pragma solidity ^0.5.10;
pragma experimental ABIEncoderV2;
import "../interfaces/INiftyswapFactory.sol";
import "../interfaces/INiftyswapExchange.sol";
import "multi-token-standard/contracts/interfaces/IERC1155.sol";
import "multi-token-standard/contracts/tokens/ERC1155/ERC1155Meta.sol";
import "multi-token-standard/contracts/tokens/ERC1155/ERC1155MintBurn.sol";
import "multi-token-standard/contracts/tokens/ERC1155/ERC1155Metadata.sol";


/**
 * This Uniswap-like implementation supports ERC-1155 standard tokens
 * with Base Tokens as a base currency instead of Ether. Dai is automatically
 * converted to Base Tokens when transferred, but wrapper methods exists to
 * wrap or unwrap DAI for every trade.
 *
 * See https://github.com/horizon-games/ERC20-meta-wrapper for explanation
 * on meta 'Base Tokens'.
 *
 * Liquidity tokens are also ERC-1155 tokens you can find the ERC-1155
 * implementation used here:
 *    https://github.com/horizon-games/multi-token-standard/tree/master/contracts/tokens/ERC1155
 */
contract NiftyswapExchange is ERC1155Metadata, ERC1155MintBurn, ERC1155Meta {

  /**
   * TO DO
   *   - Add DAI wrapp / unwrap (perhaps proxy)
   *   - remove all events?
   *   - Allow recipient different from _from? Change event accordingly
   *   - Maybe not revert if one token trade fails in liquidity methods? skip?
   *   - Optimizations
   *   - Min liquidity tokens in AddLiquidity?
   *   - Check rounding error for addLiquidity & getBuyPrice
   */

  /***********************************|
  |        Variables && Events        |
  |__________________________________*/

  // Variables
  IERC1155 token;              // address of the ERC-1155 token contract
  IERC1155 baseToken;          // address of the ERC-1155 base token traded on this contract
  INiftyswapFactory factory;   // interface for the factory that created this contract
  uint256 baseTokenID;         // ID of base token in ERC-1155 base contract
  uint256 feeMultiplier = 995; // Multiplier that calculates the fee (0.7%)

  // OnReceive Objects
  struct BuyTokensObj {
    uint256[] tokensBoughtIDs;
    uint256[] tokensBoughtAmounts;
    uint256 deadline;
  }
  struct SellTokensObj {
    uint256 minBaseTokens;
    uint256 deadline;
  }
  struct AddLiquidityObj {
    uint256[] maxBaseTokens;
    uint256 deadline;
  }
  struct RemoveLiquidityObj {
    uint256[] minBaseTokens;
    uint256[] minTokens;
    uint256 deadline;
  }

  // Signatures for onReceive control logic
  // bytes4(keccak256(
  //   "BuyTokensObj(uint256[],uint256[],uint256)"
  // ));
  bytes4 internal constant BUYTOKENS_SIG = 0xaf183a2d;

  // bytes4(keccak256(
  //   "SellTokensObj(uint256,uint256)"
  // ));
  bytes4 internal constant SELLTOKENS_SIG = 0x7775c516;

  //  bytes4(keccak256(
  //   "AddLiquidityObj(uint256[],uint256)"
  // ));
  bytes4 internal constant ADDLIQUIDITY_SIG = 0xdae60727;

  // bytes4(keccak256(
  //    "RemoveLiquidityObj(uint256[],uint256[],uint256)"
  // ));
  bytes4 internal constant REMOVELIQUIDITY_SIG = 0xf6384fca;

  // bytes4(keccak256(
  //   "DepositTokens()"
  // ));
  bytes4 internal constant DEPOSIT_SIG = 0xc8c323f9;

  // Mapping variables
  mapping(uint256 => uint256) internal totalSupplies;    // UNI token supply per Token id
  mapping(uint256 => uint256) internal baseTokenReserve; // Base Token reserve per Token id

  // Events
  event TokensPurchase(address indexed buyer, uint256[] tokensBoughtIds, uint256[] tokensBoughtAmounts, uint256[] baseTokensSoldAmounts);
  event BaseTokenPurchase(address indexed buyer, uint256[] tokensSoldIds, uint256[] tokensSoldAmounts, uint256[] baseTokensBoughtAmounts);
  event AddLiquidity(address indexed provider, uint256[] tokenIds, uint256[] tokenAmounts, uint256[] baseTokenAmounts);
  event RemoveLiquidity(address indexed provider, uint256[] tokenIds, uint256[] tokenAmounts, uint256[] baseTokenAmounts);


  /***********************************|
  |            Constructor           |
  |__________________________________*/

  /**
   * @notice Create instance of exchange contract with respective token and base token
   * @param _tokenAddr     The address of the ERC-1155 Token
   * @param _baseTokenAddr The address of the ERC-1155 Base Token
   * @param _baseTokenID   The ID of the ERC-1155 Base Token
   */
  constructor(address _tokenAddr, address _baseTokenAddr, uint256 _baseTokenID) public {
    require(
      address(_tokenAddr) != address(0) && _baseTokenAddr != address(0),
      "NiftyswapExchange#constructor:INVALID_INPUT"
    );
    factory = INiftyswapFactory(msg.sender);
    token = IERC1155(_tokenAddr);
    baseToken = IERC1155(_baseTokenAddr);
    baseTokenID = _baseTokenID;
  }

  /**
   * @notice Prevents receiving Ether or calls to unsuported methods
   */
  function () external {
    revert("UNSUPPORTED_METHOD");
  }


  /***********************************|
  |      Receiver Method Handler      |
  |__________________________________*/

  /**
   * @notice Handle which method is being called on transfer
   * @dev `_data` must be encoded as follow: abi.encode(bytes4, MethodObj)
   *   where bytes4 argument is the MethodObj object signature passed as defined
   *   in the `Signatures for onReceive control logic` section above
   * @param _operator The address which called the `safeTransferFrom` function
   * @param _from     The address which previously owned the Token
   * @param _ids      An array containing ids of each Token being transferred
   * @param _amounts  An array containing amounts of each Token being transferred
   * @param _data     Method signature and corresponding encoded arguments for method to call on *this* contract
   * @return bytes4(keccak256("onERC1155BatchReceived(address,address,uint256[],uint256[],bytes)")
   */
  function onERC1155BatchReceived(
    address _operator,
    address _from,
    uint256[] memory _ids,
    uint256[] memory _amounts,
    bytes memory _data)
    public returns(bytes4)
  {
    // This function assumes that the ERC-1155 token contract can
    // only call `onERC1155BatchReceived()` via a valid token transfer.
    // Users must be responsible and only use this Niftyswap exchange
    // contract with ERC-1155 compliant token contracts.

    // Obtain method to call via object signature
    bytes4 functionSignature;
    assembly {
      functionSignature := mload(add(_data, 32))
      functionSignature := and(functionSignature, 0xFFFFFFFF00000000000000000000000000000000000000000000000000000000)
    }

    /***********************************|
    |           Buying Tokens           |
    |__________________________________*/

    if (functionSignature == BUYTOKENS_SIG) {
      // Tokens received need to be Token contract
      require(msg.sender == address(baseToken), "NiftyswapExchange#onERC1155BatchReceived: INVALID_BASE_TOKENS_TRANSFERRED");
      require(_ids.length == 1, "NiftyswapExchange#onERC1155BatchReceived: INVALID_BASE_TOKEN_ID_AMOUNT");
      require(_ids[0] == baseTokenID, "NiftyswapExchange#onERC1155BatchReceived: INVALID_BASE_TOKEN_ID");

      // Decode BuyTokensObj from _data to call _baseToToken()
      BuyTokensObj memory obj;
      (functionSignature, obj) = abi.decode(_data, (bytes4, BuyTokensObj));
      _baseToToken(obj.tokensBoughtIDs, obj.tokensBoughtAmounts, _amounts[0], obj.deadline, _from);

    /***********************************|
    |           Selling Tokens          |
    |__________________________________*/

    } else if (functionSignature == SELLTOKENS_SIG) {
      // Tokens received need to be Token contract
      require(msg.sender == address(token), "NiftyswapExchange#onERC1155BatchReceived: INVALID_TOKENS_TRANSFERRED");

      // Decode SellTokensObj from _data to call _tokenToBase()
      SellTokensObj memory obj;
      (functionSignature, obj) = abi.decode(_data, (bytes4, SellTokensObj));
      _tokenToBase(_ids, _amounts, obj.minBaseTokens, obj.deadline, _from);

    /***********************************|
    |      Adding Liquidity Tokens      |
    |__________________________________*/

    } else if (functionSignature == ADDLIQUIDITY_SIG) {
      // Only allow to receive ERC-1155 tokens from `token` contract
      require(msg.sender == address(token), "NiftyswapExchange#onERC1155BatchReceived: INVALID_TOKEN_TRANSFERRED");

      // Decode AddLiquidityObj from _data to call _addLiquidity()
      AddLiquidityObj memory obj;
      (functionSignature, obj) = abi.decode(_data, (bytes4, AddLiquidityObj));
      _addLiquidity(_from, _ids, _amounts, obj.maxBaseTokens, obj.deadline);

    /***********************************|
    |      Removing iquidity Tokens     |
    |__________________________________*/

    } else if (functionSignature == REMOVELIQUIDITY_SIG) {
      // Tokens received need to be UNI-1155 tokens
      require(msg.sender == address(this), "NiftyswapExchange#onERC1155BatchReceived: INVALID_UNI_TOKENS_TRANSFERRED");

      // Decode RemoveLiquidityObj from _data to call _removeLiquidity()
      RemoveLiquidityObj memory obj;
      (functionSignature, obj) = abi.decode(_data, (bytes4, RemoveLiquidityObj));
      _removeLiquidity(_from, _ids, _amounts, obj.minBaseTokens, obj.minTokens, obj.deadline);

    /***********************************|
    |      Deposits & Invalid Calls     |
    |__________________________________*/

    } else if (functionSignature == DEPOSIT_SIG) {
      /** Do nothing for when contract is self depositing */

    } else {
      revert("NiftyswapExchange#onERC1155BatchReceived: INVALID_METHOD");
    }

    return ERC1155_BATCH_RECEIVED_VALUE;
  }

  /**
   * @dev Will pass to onERC115Batch5Received
   */
  function onERC1155Received(address _operator, address _from, uint256 _id, uint256 _amount, bytes memory _data)
    public returns(bytes4)
  {
    uint256[] memory ids = new uint256[](1);
    uint256[] memory amounts = new uint256[](1);

    ids[0] = _id;
    amounts[0] = _amount;

    require(
      ERC1155_BATCH_RECEIVED_VALUE == onERC1155BatchReceived(_operator, _from, ids, amounts, _data),
      "NiftyswapExchange#onERC1155Received: INVALID_ONRECEIVED_MESSAGE"
    );

    return ERC1155_RECEIVED_VALUE;
  }


  /***********************************|
  |        Exchange Functions         |
  |__________________________________*/

  /**
   * @notice Convert Base Tokens to Tokens _id and transfers Tokens to recipient.
   * @dev User specifies MAXIMUM inputs (_maxBaseTokens) and EXACT outputs.
   * @dev Assumes that all trades will be successful, or revert the whole tx
   * @dev Sorting IDs can lead to more efficient trades with some ERC-1155 implementations
   * @param _tokenIds         Array of Tokens ID that are bought
   * @param _tokenAmounts     Amount of Tokens id bought for each corresponding Token id in _tokenIds
   * @param _maxBaseTokens    Total maximum amount of base tokens to spend for all Token ids
   * @param _deadline         Block number after which this transaction can no longer be executed.
   * @param _recipient        The address that receives output Tokens.
   */
  function _baseToToken(
    uint256[] memory _tokenIds,
    uint256[] memory _tokenAmounts,
    uint256 _maxBaseTokens,
    uint256 _deadline,
    address _recipient)
    internal
  {
    // Number of Token IDs to deposit
    uint256 nTokens = _tokenIds.length;
    uint256 totalRefundBaseTokens = _maxBaseTokens;

    // Input validation
    require(_deadline >= block.number, "NiftyswapExchange#_baseToToken: DEADLINE_EXCEEDED");
    require(nTokens == _tokenAmounts.length, "NiftyswapExchange#_baseToToken: INVALID_LENGTH_FOR_IDS_AMOUNTS");

    // Initialize variables
    uint256[] memory baseTokensSold = new uint256[](nTokens); // Amount of base tokens sold per ID
    uint256[] memory tokenReserves = new uint256[](nTokens);  // Amount of tokens in reserve for each Token id

    // Get token reserves
    tokenReserves = _getTokenReserves(_tokenIds);

    // Assumes he Base Tokens are already received by contract, but not
    // the Tokens Ids

    // Remove liquidity for each Token ID in _tokenIds
    for (uint256 i = 0; i < nTokens; i++) {
      // Store current id and amount from argument arrays
      uint256 idBought = _tokenIds[i];
      uint256 amountBought = _tokenAmounts[i];
      uint256 tokenReserve = tokenReserves[i];

      require(amountBought > 0, "NiftyswapExchange#_baseToToken: NULL_TOKENS_BOUGHT");

      // Load Base Token and Token _id reserves
      uint256 baseReserve = baseTokenReserve[idBought];

      // Get amount of Base Tokens to send for purchase
      // Neither reserves amount have been changed so far in this transaction, so
      // no adjustment to the inputs is needed
      uint256 baseTokenAmount = getBuyPrice(amountBought, baseReserve, tokenReserve);

      // Calculate Base Token amount to refund (if any) where whatever is not used will be returned
      // Will throw if total cost exceeds _maxBaseTokens
      totalRefundBaseTokens = totalRefundBaseTokens.sub(baseTokenAmount);

      // Append Token id, Token id amount and Base Token amount to tracking arrays
      baseTokensSold[i] = baseTokenAmount;

      // Update individual base reseve amount
      baseTokenReserve[idBought] = baseReserve.add(baseTokenAmount);
    }

    // // Refund Base Token if any
    if (totalRefundBaseTokens > 0) {
      baseToken.safeTransferFrom(address(this), _recipient, baseTokenID, totalRefundBaseTokens, "");
    }

    // Send Tokens all tokens purchased
    token.safeBatchTransferFrom(address(this), _recipient, _tokenIds, _tokenAmounts, "");
    emit TokensPurchase(_recipient, _tokenIds, _tokenAmounts, baseTokensSold);
  }

  /**
   * @dev Pricing function for converting between Base Tokens && Tokens.
   * @param _assetBoughtAmount  Amount of Base Tokens or Tokens being bought.
   * @param _assetSoldReserve   Amount of Base Tokens or Tokens (input type) in exchange reserves.
   * @param _assetBoughtReserve Amount of Base Tokens or Tokens (output type) in exchange reserves.
   */
  function getBuyPrice(
    uint256 _assetBoughtAmount,
    uint256 _assetSoldReserve,
    uint256 _assetBoughtReserve)
    public view returns (uint256)
  {
    //Reserves must not be empty
    require(_assetSoldReserve > 0 && _assetBoughtReserve > 0, "NiftyswapExchange#getBuyPrice: EMPTY_RESERVE");

    // Calculate price with fee
    uint256 numerator = _assetSoldReserve.mul(_assetBoughtAmount).mul(1000);
    uint256 denominator = (_assetBoughtReserve.sub(_assetBoughtAmount)).mul(feeMultiplier);
    return numerator / denominator;
  }

  /**
   * @notice Convert Tokens _id to Base Tokens and transfers Tokens to recipient.
   * @dev User specifies EXACT Tokens _id sold and MINIMUM Base Tokens received.
   * @dev Assumes that all trades will be valid, or the whole tx will fail
   * @param _tokenIds          Array of Token IDs that are sold
   * @param _tokensSoldAmounts Array of Amount of Tokens sold for each id in _tokenIds.
   * @param _minBaseTokens     Minimum amount of Base Tokens to receive
   * @param _deadline          Block number after which this transaction can no longer be executed.
   * @param _recipient         The address that receives output Base Tokens.
   */
  function _tokenToBase(
    uint256[] memory _tokenIds,
    uint256[] memory _tokensSoldAmounts,
    uint256 _minBaseTokens,
    uint256 _deadline,
    address _recipient)
    internal
  {
    // Number of Token IDs to deposit
    uint256 nTokens = _tokenIds.length;

    // Input validation
    require(_deadline >= block.number, "NiftyswapExchange#_tokenToBase: DEADLINE_EXCEEDED");
    require(nTokens == _tokensSoldAmounts.length, "NiftyswapExchange#_tokenToBase: INVALID_LENGTH_FOR_IDS_AMOUNTS");

    // Initialize variables
    uint256 totalBaseTokens = 0; // Total amount of Base tokens to transfer
    uint256[] memory baseTokensBougth = new uint256[](nTokens);
    uint256[] memory tokenReserves = new uint256[](nTokens);

    // Get token reserves
    tokenReserves = _getTokenReserves(_tokenIds);

    // Assumes the Tokens ids are already received by contract, but not
    // the Tokens Ids. Will return cards not sold if invalid price.

    // Remove liquidity for each Token ID in _tokenIds
    for (uint256 i = 0; i < nTokens; i++) {
      // Store current id and amount from argument arrays
      uint256 idSold = _tokenIds[i];
      uint256 amountSold = _tokensSoldAmounts[i];
      uint256 tokenReserve = tokenReserves[i];

      // If 0 tokens send for this ID, revert
      require(amountSold > 0, "NiftyswapExchange#_tokenToBase: NULL_TOKENS_SOLD");

      // Load Base Token and Token _id reserves
      uint256 baseReserve = baseTokenReserve[idSold];

      // Get amount of Based Tokens that will be received
      // Need to sub amountSold because tokens already added in reserve, which would bias the calculation
      // Don't need to add it for baseReserve because the amount is added after this calculation
      uint256 baseTokenAmount = getSellPrice(amountSold, tokenReserve.sub(amountSold), baseReserve);

      // Increase cost of transaction
      totalBaseTokens = totalBaseTokens.add(baseTokenAmount);

      // Update individual base reseve amount
      baseTokenReserve[idSold] = baseReserve.sub(baseTokenAmount);

      // Append Token id, Token id amount and Base Token amount to tracking arrays
      baseTokensBougth[i] = baseTokenAmount;
    }

    // If minBaseTokens is not met
    require(totalBaseTokens >= _minBaseTokens, "NiftyswapExchange#_tokenToBase: INSUFFICIENT_BASE_TOKENS");

    // Transfer baseTokens here
    baseToken.safeTransferFrom(address(this), _recipient, baseTokenID, totalBaseTokens, "");

    // Might need to emit in onReceive
    emit BaseTokenPurchase(_recipient, _tokenIds, _tokensSoldAmounts, baseTokensBougth);
  }

  /**
   * @dev Pricing function for converting between Base Tokens && Tokens.
   * @param _assetSoldAmount    Amount of Base Tokens or Tokens being sold.
   * @param _assetSoldReserve   Amount of Base Tokens or Tokens (output type) in exchange reserves.
   * @param _assetBoughtReserve Amount of Base Tokens or Tokens (input type) in exchange reserves.
   * @return Amount of Base Tokens or Tokens to receive from Niftyswap.
   */
  function getSellPrice(
    uint256 _assetSoldAmount,
    uint256 _assetSoldReserve,
    uint256 _assetBoughtReserve)
    public view returns (uint256)
  {
    //Reserves must not be empty
    require(_assetSoldReserve > 0 && _assetBoughtReserve > 0, "NiftyswapExchange#getSellPrice: EMPTY_RESERVE");

    // Calculate amount to receive (with fee)
    uint256 _assetSoldAmount_withFee = _assetSoldAmount.mul(feeMultiplier);
    uint256 numerator = _assetSoldAmount_withFee.mul(_assetBoughtReserve);
    uint256 denominator = _assetSoldReserve.mul(1000).add(_assetSoldAmount_withFee);
    return numerator / denominator;
  }


  /***********************************|
  |        Liquidity Functions        |
  |__________________________________*/

  /**
   * @notice Deposit max Base Tokens && exact Tokens (token ID) at current ratio to mint UNI-1155 tokens.
   * @dev min_liquidity does nothing when total UNI supply is 0.
   * @dev Assumes that sender approved this contract on the baseToken
   * @param _provider      Address that provides liquidity to the reserve
   * @param _tokenIds      Array of Token IDs where liquidity is added
   * @param _tokenAmounts  Array of amount of Tokens deposited corresponding to each ID provided in _tokenIds
   * @param _maxBaseTokens Array of maximum number of tokens deposited for each ID provided in _tokenIds.
  *                        Deposits max amount if total UNI supply is 0.
   * @param _deadline      Block number after which this transaction can no longer be executed.
   */
  function _addLiquidity(
    address _provider,
    uint256[] memory _tokenIds,
    uint256[] memory _tokenAmounts,
    uint256[] memory _maxBaseTokens,
    uint256 _deadline)
    internal
  {
    // // Initialize variables
    uint256 nTokens = _tokenIds.length; // Number of Token IDs to deposit
    uint256 totalBaseTokens = 0;        // Total amount of Base tokens to transfer

    //Requirements
    require(_deadline >= block.number, "NiftyswapExchange#_addLiquidity: DEADLINE_EXCEEDED");
    require(nTokens == _tokenAmounts.length, "NiftyswapExchange#_addLiquidity: INVALID_LENGTH_FOR_IDS_AMOUNTS");
    require(nTokens == _maxBaseTokens.length, "NiftyswapExchange#_addLiquidity: INVALID_LENGTH_FOR_MAXBASETOKENS");

    // Initialize arrays
    uint256[] memory liquiditiesToMint = new uint256[](nTokens);
    uint256[] memory baseTokenAmounts = new uint256[](nTokens);
    uint256[] memory tokenReserves = new uint256[](nTokens);

    // Get token reserves
    tokenReserves = _getTokenReserves(_tokenIds);

    // Assumes tokens _ids are deposited already, but not Base Tokens
    // as this is calculated and executed below.

    // Loop over all Token IDs to deposit
    for (uint256 i = 0; i < nTokens; i ++) {
      // Store current id and amount from argument arrays
      uint256 id = _tokenIds[i];
      uint256 amount = _tokenAmounts[i];

      // Check if input values are acceptable
      require(_maxBaseTokens[i] > 0, "NiftyswapExchange#_addLiquidity: NULL_MAX_BASE_TOKEN");
      require(amount > 0, "NiftyswapExchange#_addLiquidity: NULL_TOKENS_AMOUNT");

      // Current total liquidity calculated in base token
      uint256 totalLiquidity = totalSupplies[id];

      // When reserve for this token already exists
      if (totalLiquidity > 0) {

        // Load Base Token and Token reserve's supply of Token id
        uint256 baseReserve = baseTokenReserve[id]; // Amount not yet in reserve
        uint256 tokenReserve = tokenReserves[i];

        /**
        * Amount of base tokens to send to token id reserve:
        * X/Y = dx/dy
        * dx = X*dy/Y
        * where
        *   X:  Base token total liquidity
        *   Y:  Token _id total liquidity (before tokens were received)
        *   dy: Amount of token _id deposited
        *   dx: Amount of base token to deposit
        */
        uint256 baseTokenAmount = amount.mul(baseReserve) / (tokenReserve.sub(amount));
        require(_maxBaseTokens[i] >= baseTokenAmount, "NiftyswapExchange#_addLiquidity: MAX_BASE_TOKENS_EXCEEDED");

        // Update Base Token reserve size for Token id before transfer
        baseTokenReserve[id] = baseReserve.add(baseTokenAmount);

        // Update totalBaseTokens
        totalBaseTokens = totalBaseTokens.add(baseTokenAmount);

        // Proportion of the liquidity pool to give to current liquidity provider
        liquiditiesToMint[i] = baseTokenAmount.mul(totalLiquidity) / baseReserve;
        baseTokenAmounts[i] = baseTokenAmount;

        // Mint liquidity ownership tokens and increase liquidity supply accordingly
        totalSupplies[id] = totalLiquidity.add(liquiditiesToMint[i]);

      } else {
        uint256 maxBaseToken = _maxBaseTokens[i];

        // Otherwise rounding error could end up being significant on second deposit
        require(maxBaseToken >= 1000000000, "NiftyswapExchange#_addLiquidity: INVALID_BASE_TOKEN_AMOUNT");

        // // Update Base Token reserve size for Token id before transfer
        baseTokenReserve[id] = maxBaseToken;

        // Update totalBaseTokens
        totalBaseTokens = totalBaseTokens.add(maxBaseToken);

        // // Initial liquidity is amount deposited (Incorrect pricing will be arbitraged)
        // // uint256 initialLiquidity = _maxBaseTokens;
        totalSupplies[id] = maxBaseToken;

        // Liquidity to mints
        liquiditiesToMint[i] = maxBaseToken;
        baseTokenAmounts[i] = maxBaseToken;
      }
    }
    // Mint UNI tokens
    _batchMint(_provider, _tokenIds, liquiditiesToMint, "");

    // Transfer all Base Tokens to this contract
    baseToken.safeTransferFrom(_provider, address(this), baseTokenID, totalBaseTokens, abi.encodePacked(DEPOSIT_SIG));

    // Emit event
    emit AddLiquidity(_provider, _tokenIds, _tokenAmounts, baseTokenAmounts);
  }

  /**
   * @dev Burn UNI tokens to withdraw Base Tokens && Tokens at current ratio.
   * @param _provider        Address that removes liquidity to the reserve
   * @param _tokenIds        Array of Token IDs where liquidity is removed
   * @param _UNItokenAmounts Array of Amount of UNI burned for each Token id in _tokenIds.
   * @param _minBaseTokens   Minimum Tase Tokens withdrawn for each Token id in _tokenIds.
   * @param _minTokens       Minimum Tokens id withdrawn for each Token id in _tokenIds.
   * @param _deadline        Block number after which this transaction can no longer be executed.
   */
  function _removeLiquidity(
    address _provider,
    uint256[] memory _tokenIds,
    uint256[] memory _UNItokenAmounts,
    uint256[] memory _minBaseTokens,
    uint256[] memory _minTokens,
    uint256 _deadline)
    internal
  {
    // Initialize variables
    uint256 nTokens = _tokenIds.length;                     // Number of Token IDs to deposit
    uint256 totalBaseTokens = 0;                            // Total amount of Base tokens to transfer
    uint256[] memory tokenAmounts = new uint256[](nTokens); // Amount of Tokens to transfer for each id
    uint256[] memory baseTokenAmounts = new uint256[](nTokens); // Amount of Base Tokens to transfer for each id
    uint256[] memory tokenReserves = new uint256[](nTokens);

    // Get token reserves
    tokenReserves = _getTokenReserves(_tokenIds);

    // Assumes UNI tokens are already received by contract, but not
    // the Base Tokens nor the Tokens Ids

    // Input validation
    require(_deadline > block.number, "NiftyswapExchange#_removeLiquidity: DEADLINE_EXCEEDED");
    require(_tokenIds.length == _UNItokenAmounts.length, "NiftyswapExchange#_removeLiquidity: INVALID_LENGTH_FOR_IDS_AMOUNTS");
    require(_tokenIds.length == _minBaseTokens.length, "NiftyswapExchange#_removeLiquidity: INVALID_LENGTH_FOR_MINBASETOKENS");
    require(_tokenIds.length == _minTokens.length, "NiftyswapExchange#_removeLiquidity: INVALID_LENGTH_FOR__MINTOKENS");

    // Remove liquidity for each Token ID in _tokenIds
    for (uint256 i = 0; i < nTokens; i++) {
      // Store current id and amount from argument arrays
      uint256 id = _tokenIds[i];
      uint256 amountUNI = _UNItokenAmounts[i];
      uint256 tokenReserve = tokenReserves[i];

      // Load total UNI supply for Token _id
      uint256 totalLiquidity = totalSupplies[id];
      require(totalLiquidity > 0, "NiftyswapExchange#_removeLiquidity: NULL_TOTAL_LIQUIDITY");

      // Load Base Token and Token reserve's supply of Token id
      uint256 baseReserve = baseTokenReserve[id];

      // Calculate amount to withdraw for Base Tokens and Token _id
      uint256 baseTokenAmount = amountUNI.mul(baseReserve) / totalLiquidity;
      uint256 tokenAmount = amountUNI.mul(tokenReserve) / totalLiquidity;

      // Verify if amounts to withdraw respect minimums specified
      require(baseTokenAmount >= _minBaseTokens[i], "NiftyswapExchange#_removeLiquidity: INSUFFICIENT_BASE_TOKENS");
      require(tokenAmount >= _minTokens[i], "NiftyswapExchange#_removeLiquidity: INSUFFICIENT_TOKENS");

      // Update total UNI supply of Token _id
      totalSupplies[id] = totalLiquidity.sub(amountUNI);

      // Update Base Token reserve size for Token id
      baseTokenReserve[id] = baseReserve.sub(baseTokenAmount);

      // Update totalBaseToken and tokenAmounts
      totalBaseTokens = totalBaseTokens.add(baseTokenAmount);
      tokenAmounts[i] = tokenAmount;
      baseTokenAmounts[i] = baseTokenAmount;
    }

    // Burn UNI tokens for offchain supplies
    _batchBurn(address(this), _tokenIds, _UNItokenAmounts);

    // Transfer total Base Tokens and all Tokens ids
    baseToken.safeTransferFrom(address(this), _provider, baseTokenID, totalBaseTokens, "");
    token.safeBatchTransferFrom(address(this), _provider, _tokenIds, tokenAmounts, "");

    // Emit event
    emit RemoveLiquidity(_provider, _tokenIds, tokenAmounts, baseTokenAmounts);
  }


  /***********************************|
  |         Getter Functions          |
  |__________________________________*/

  /**
   * @notice Get amount of Base Token in reserve for each Token _id in _ids
   * @param _ids Array of ID sto query Base Token reserve of
   * @return amount of Base Token in reserve for each Token _id
   */
  function getBaseTokenReserves(
    uint256[] calldata _ids)
    external view returns (uint256[] memory)
  {
    uint256 nIds = _ids.length;
    uint256[] memory baseReserves = new uint256[](nIds);
    for (uint256 i = 0; i < nIds; i++) {
      baseReserves[i] = baseTokenReserve[_ids[i]];
    }
    return baseReserves;
  }

  /**
   * @notice Return price for `Base Token => Token _id` trades with an exact token amount.
   * @param _ids           Array of ID of tokens bought.
   * @param _tokensBoughts Amount of Tokens bought.
   * @return Amount of Base Tokens needed to buy each Token in _ids
   */
  function getPrice_baseToToken(
    uint256[] calldata _ids,
    uint256[] calldata _tokensBoughts)
    external view returns (uint256[] memory)
  {
    uint256 nIds = _ids.length;
    uint256[] memory prices = new uint256[](nIds);

    for (uint256 i = 0; i < nIds; i++) {
      // Load Token id reserve
      uint256 tokenReserve = token.balanceOf(address(this), _ids[i]);
      prices[i] = getBuyPrice(_tokensBoughts[i], baseTokenReserve[_ids[i]], tokenReserve);
    }

    // Return prices
    return prices;
  }

  /**
   * @notice Return price for `Token _id => Base Token` trades with an exact token amount.
   * @param _ids        Array of IDs  token sold.
   * @param _tokensSold Array of amount of each Token sold.
   * @return Amount of Base Tokens that can be bought for each Token in _ids
   */
  function getPrice_tokenToBase(
    uint256[] calldata _ids,
    uint256[] calldata _tokensSold)
    external view returns (uint256[] memory)
  {
    uint256 nIds = _ids.length;
    uint256[] memory prices = new uint256[](nIds);

    for (uint256 i = 0; i < nIds; i++) {
      // Load Token id reserve
      uint256 tokenReserve = token.balanceOf(address(this), _ids[i]);
      prices[i] = getSellPrice(_tokensSold[i], tokenReserve, baseTokenReserve[_ids[i]]);
    }

    // Return price
    return prices;
  }

  /**
   * @return Address of Token that is sold on this exchange.
   */
  function tokenAddress() external view returns (address) {
    return address(token);
  }

  /**
   * @return Address of factory that created this exchange.
   */
  function factoryAddress() external view returns (address) {
    return address(factory);
  }


  /***********************************|
  |         Utility Functions         |
  |__________________________________*/

  /**
   * @notice Return Niftyswap Token reserves for given Token ids
   * @param _tokenIds Array of IDs to query their Reserve balance.
   * @return Array of Token ids' reserves
   */
  function _getTokenReserves(
    uint256[] memory _tokenIds)
    internal view returns (uint256[] memory)
  {
    uint256 nTokens = _tokenIds.length;
    uint256[] memory tokenReserves = new uint256[](nTokens);

    // Regular balance query if only 1 token, otherwise batch query
    if (nTokens == 1) {
      tokenReserves[0] = token.balanceOf(address(this), _tokenIds[0]);

    } else {
      // Get current reserve amount for each token ID
      address[] memory thisAddressArray = new address[](nTokens);
      for (uint256 i = 0; i < nTokens; i++) {
        thisAddressArray[i] = address(this);
      }
      tokenReserves = token.balanceOfBatch(thisAddressArray, _tokenIds);
    }

    return tokenReserves;
  }

  /**
   * @notice Indicates whether a contract implements the `ERC1155TokenReceiver` functions and so can accept ERC1155 token types.
   * @param  interfaceID The ERC-165 interface ID that is queried for support.s
   * @dev This function MUST return true if it implements the ERC1155TokenReceiver interface and ERC-165 interface.
   *      This function MUST NOT consume more than 5,000 gas.
   * @return Wheter ERC-165 or ERC1155TokenReceiver interfaces are supported.
   */
  function supportsInterface(bytes4 interfaceID) external view returns (bool) {
    return  interfaceID == 0x01ffc9a7 || // ERC-165 support (i.e. `bytes4(keccak256('supportsInterface(bytes4)'))`).
      interfaceID == 0x4e2312e0;         // ERC-1155 `ERC1155TokenReceiver` support (i.e. `bytes4(keccak256("onERC1155Received(address,address,uint256,uint256,bytes)")) ^ bytes4(keccak256("onERC1155BatchReceived(address,address,uint256[],uint256[],bytes)"))`).
  }

}
