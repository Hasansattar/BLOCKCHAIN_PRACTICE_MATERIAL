// SPDX-License-Identifier: MIT

pragma solidity 0.6.12;
pragma experimental ABIEncoderV2;
import 'hardhat/console.sol';

import {Ownable} from '@aave/protocol-v2/contracts/dependencies/openzeppelin/contracts/Ownable.sol';
import {IERC20} from '@aave/protocol-v2/contracts/dependencies/openzeppelin/contracts/IERC20.sol';
import {ILendingPoolAddressesProvider} from '@aave/protocol-v2/contracts/interfaces/ILendingPoolAddressesProvider.sol';
import {ILendingPool} from '@aave/protocol-v2/contracts/interfaces/ILendingPool.sol';
import {FlashLoanReceiverBase} from '@aave/protocol-v2/contracts/flashloan/base/FlashLoanReceiverBase.sol';

/**
 *
 * A Contract that uses AAVE flashloans to arbitrage
 *
 * call swap() to begin trading
 * Author: Dennoh Peter
 * Club: Wakulima Wadogo
 */

interface ERC20 {
    function deposit() external payable;

    function withdraw(uint256 amount) external;
}

contract TradingBot is FlashLoanReceiverBase, Ownable {
    address ONEINCH_ROUTER;

    struct SwapParams {
        address _fromToken;
        address _toToken;
        uint256 _fromAmount;
        bytes _oneInchCallBuyData;
        bytes _oneInchCallSellData;
    }

    constructor(
        ILendingPoolAddressesProvider _addressesProvider,
        address _oneInchRouter
    ) public FlashLoanReceiverBase(_addressesProvider) {
        ONEINCH_ROUTER = _oneInchRouter;
    }

    function executeOperation(
        address[] calldata assets,
        uint256[] calldata amounts,
        uint256[] calldata premiums,
        address initiator,
        bytes calldata params
    ) external override returns (bool) {
        require(
            msg.sender == address(LENDING_POOL),
            'CALLER_MUST_BE_LENDING_POOL'
        );

        SwapParams memory _decodedParams = _decodeParams(params);

        require(
            assets.length == 1 && assets[0] == _decodedParams._fromToken,
            'INCONSISTENT_PARAMS'
        );

        _arb(
            _decodedParams._fromToken,
            _decodedParams._toToken,
            _decodedParams._fromAmount,
            _decodedParams._oneInchCallBuyData,
            _decodedParams._oneInchCallSellData
        );

        uint256 _flashLoanDebt = amounts[0].add(premiums[0]);

        // Allow repay of flash loan
        IERC20(_decodedParams._fromToken).safeApprove(
            address(LENDING_POOL),
            _flashLoanDebt
        );

        uint256 _remainingTokens = IERC20(_decodedParams._fromToken)
            .balanceOf(address(this))
            .sub(_flashLoanDebt);

        // Transfer remaining tokens to initiator
        if (_remainingTokens > 0) {
            IERC20(_decodedParams._fromToken).safeTransfer(
                initiator,
                _remainingTokens
            );
        }

        return true;
    }

    function _arb(
        address _fromToken,
        address _toToken,
        uint256 _fromAmount,
        bytes memory _oneInchCallBuyData,
        bytes memory _oneInchCallSellData
    ) internal {
        // Track original balance
        uint256 _startBalance = IERC20(_fromToken).balanceOf(address(this));
        // Perform the arb trade
        _trade(
            _fromToken,
            _toToken,
            _fromAmount,
            _oneInchCallBuyData,
            _oneInchCallSellData
        );
        // Track result balance
        uint256 _endBalance = IERC20(_fromToken).balanceOf(address(this));

        // Require that arbitrage is profitable
        require(
            _endBalance > _startBalance,
            'End balance must exceed start balance.'
        );
    }

    function _trade(
        address _fromToken,
        address _toToken,
        uint256 _fromAmount,
        bytes memory _oneInchCallBuyData,
        bytes memory _oneInchCallSellData
    ) internal {
        // Track the balance of the token RECEIVED from the trade
        uint256 _beforeBalance = IERC20(_toToken).balanceOf(address(this));

        // Swap on 1Inch: give _fromToken , receive _toToken
        _oneInchSwap(_fromToken, _fromAmount, _oneInchCallBuyData);

        // Calculate the how much of the token we received
        uint256 _afterBalance = IERC20(_toToken).balanceOf(address(this));

        // Read _toToken balance after swap
        uint256 _toAmount = _afterBalance.sub(_beforeBalance);

        // Swap on 1Inch: give _toToken, receive _fromToken
        _oneInchSwap(_toToken, _toAmount, _oneInchCallSellData);
    }

    // TODO Remove this function is only for testing swapping on 1inch dex
    function oneInchSwap(
        address _from,
        uint256 _amount,
        bytes memory _oneInchCallData
    ) external payable onlyOwner {
        _oneInchSwap(_from, _amount, _oneInchCallData);
    }

    /**
     * Perfoms swap using 1inch dex aggregator
     * @param _fromToken - src token
     * @param _amount - src token amount to swap
     * @param _oneInchCallData - Tx data from swap endpoint of 1inch api
     */
    function _oneInchSwap(
        address _fromToken,
        uint256 _amount,
        bytes memory _oneInchCallData
    ) internal {
        IERC20 _fromIERC20 = IERC20(_fromToken);

        // ERC20(_fromToken).deposit{value: msg.value}();

        _fromIERC20.transferFrom(msg.sender, address(this), _amount);

        // Approve tokens
        _fromIERC20.approve(ONEINCH_ROUTER, _amount);

        uint256 _allBalance = IERC20(_fromToken).balanceOf(address(this));

        console.log('balance', address(this), _allBalance);

        // // // Swap tokens: give _fromToken, get _toToken
        // (bool success, bytes memory returnData) = ONEINCH_ROUTER.call{
        //     value: msg.value
        // }(_oneInchCallData);

        (bool success, bytes memory returnData) = ONEINCH_ROUTER.call(
            _oneInchCallData
        );

        if (success) {
            (uint256 returnAmount, uint256 gasLeft) = abi.decode(
                returnData,
                (uint256, uint256)
            );
            // require(returnAmount >= minOut);
        } else {
            revert();
        }

        // revert(
        //     RevertReasonParser.parse(
        //         returnData,
        //         string(abi.encodePacked('Callbytes failed: '))
        //     )
        // );

        // require(success, '1INCH_SWAP_CALL_FAILED');
    }

    function _decodeParams(bytes memory params)
        internal
        pure
        returns (SwapParams memory)
    {
        (
            address _fromToken,
            address _toToken,
            uint256 _fromAmount,
            bytes memory _oneInchCallBuyData,
            bytes memory _oneInchCallSellData
        ) = abi.decode(params, (address, address, uint256, bytes, bytes));

        return
            SwapParams(
                _fromToken,
                _toToken,
                _fromAmount,
                _oneInchCallBuyData,
                _oneInchCallSellData
            );
    }

    function swap(
        address[] calldata assets,
        uint256[] calldata amounts,
        uint256[] calldata modes,
        bytes calldata params
    ) external payable onlyOwner {
        // Request a Flash Loan to Lending Pool
        ILendingPool(LENDING_POOL).flashLoan(
            address(this), // receiverAddress
            assets,
            amounts,
            modes, // 0 = no debt, 1 = stable, 2 = variable
            address(this), // onBehalfOf
            params,
            0 // referralCode
        );

        // Transfer the remaining collateral to the msg.sender
        uint256 _allBalance = IERC20(assets[0]).balanceOf(address(this));
        IERC20(assets[0]).safeTransfer(msg.sender, _allBalance);
    }

    function updateRouterAddress(address _newAddress) external onlyOwner {
        ONEINCH_ROUTER = _newAddress;
    }

    // KEEP THIS FUNCTION IN CASE THE CONTRACT RECEIVES TOKENS!
    function withdrawToken(address _tokenAddress) external onlyOwner {
        uint256 balance = IERC20(_tokenAddress).balanceOf(address(this));
        IERC20(_tokenAddress).transfer(msg.sender, balance);
    }

    // KEEP THIS FUNCTION IN CASE THE CONTRACT KEEPS LEFTOVER ETHER!
    function withdrawEther() external onlyOwner {
        address self = address(this);
        // workaround for a possible solidity bug
        uint256 balance = self.balance;
        payable(msg.sender).transfer(balance);
    }
}

/// @title Library that allows to parse unsuccessful arbitrary calls revert reasons.
/// See https://solidity.readthedocs.io/en/latest/control-structures.html#revert for details.
/// Note that we assume revert reason being abi-encoded as Error(string) so it may fail to parse reason
/// if structured reverts appear in the future.
///
/// All unsuccessful parsings get encoded as Unknown(data) string
library RevertReasonParser {
    bytes4 private constant _PANIC_SELECTOR =
        bytes4(keccak256('Panic(uint256)'));
    bytes4 private constant _ERROR_SELECTOR =
        bytes4(keccak256('Error(string)'));

    function parse(bytes memory data, string memory prefix)
        internal
        pure
        returns (string memory)
    {
        if (data.length >= 4) {
            bytes4 selector;
            assembly {
                // solhint-disable-line no-inline-assembly
                selector := mload(add(data, 0x20))
            }

            // 68 = 4-byte selector + 32 bytes offset + 32 bytes length
            if (selector == _ERROR_SELECTOR && data.length >= 68) {
                uint256 offset;
                bytes memory reason;
                // solhint-disable no-inline-assembly
                assembly {
                    // 36 = 32 bytes data length + 4-byte selector
                    offset := mload(add(data, 36))
                    reason := add(data, add(36, offset))
                }
                /*
                    revert reason is padded up to 32 bytes with ABI encoder: Error(string)
                    also sometimes there is extra 32 bytes of zeros padded in the end:
                    https://github.com/ethereum/solidity/issues/10170
                    because of that we can't check for equality and instead check
                    that offset + string length + extra 36 bytes is less than overall data length
                */
                require(
                    data.length >= 36 + offset + reason.length,
                    'Invalid revert reason'
                );
                return string(abi.encodePacked(prefix, 'Error(', reason, ')'));
            }
            // 36 = 4-byte selector + 32 bytes integer
            else if (selector == _PANIC_SELECTOR && data.length == 36) {
                uint256 code;
                // solhint-disable no-inline-assembly
                assembly {
                    // 36 = 32 bytes data length + 4-byte selector
                    code := mload(add(data, 36))
                }
                return
                    string(
                        abi.encodePacked(prefix, 'Panic(', _toHex(code), ')')
                    );
            }
        }

        return string(abi.encodePacked(prefix, 'Unknown(', _toHex(data), ')'));
    }

    function _toHex(uint256 value) private pure returns (string memory) {
        return _toHex(abi.encodePacked(value));
    }

    function _toHex(bytes memory data) private pure returns (string memory) {
        bytes16 alphabet = 0x30313233343536373839616263646566;
        bytes memory str = new bytes(2 + data.length * 2);
        str[0] = '0';
        str[1] = 'x';
        for (uint256 i = 0; i < data.length; i++) {
            str[2 * i + 2] = alphabet[uint8(data[i] >> 4)];
            str[2 * i + 3] = alphabet[uint8(data[i] & 0x0f)];
        }
        return string(str);
    }
}
