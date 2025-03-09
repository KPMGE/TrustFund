// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./LendingContract.sol";

contract LendingFactory {
    struct BorrowingRequest {
        uint256 id;
        address borrower;
        uint256 loanAmount;
        uint256 interestRate;
        uint256 repaymentPeriod;
        bool isFunded;
    }

    BorrowingRequest[] public borrowingRequests;
    address[] public lendingContracts;

    event BorrowingRequestCreated(uint256 indexed requestId, address indexed borrower);
    event LendingContractCreated(address indexed contractAddress, address indexed borrower, address indexed lender);

    // Borrowers create borrowing requests
    function createBorrowingRequest(
        uint256 _loanAmount,
        uint256 _interestRate,
        uint256 _repaymentPeriod
    ) external {
        borrowingRequests.push(BorrowingRequest({
            id: borrowingRequests.length,
            borrower: msg.sender,
            loanAmount: _loanAmount,
            interestRate: _interestRate,
            repaymentPeriod: _repaymentPeriod,
            isFunded: false
        }));
        emit BorrowingRequestCreated(borrowingRequests.length - 1, msg.sender);
    }

    // Lenders fund borrowing requests
    function fundBorrowingRequest(uint256 _requestId) external payable {
        require(_requestId < borrowingRequests.length, "Invalid request ID");
        BorrowingRequest storage request = borrowingRequests[_requestId];
        require(!request.isFunded, "Request is already funded");
        require(msg.value == request.loanAmount, "Incorrect loan amount");

        // Mark the request as funded
        request.isFunded = true;

        // Deploy a new LendingContract
        LendingContract newContract = new LendingContract(
            request.borrower,
            request.loanAmount,
            request.interestRate,
            request.repaymentPeriod
        );
 
        // Fund the loan in the LendingContract
        newContract.fundLoan{value: msg.value}();

        // Store the contract address
        lendingContracts.push(address(newContract));

        emit LendingContractCreated(address(newContract), request.borrower, msg.sender);
    }

    // Get all borrowing requests
    function getBorrowingRequests() external view returns (BorrowingRequest[] memory) {
        return borrowingRequests;
    }

    // Get all lending contracts
    function getLendingContracts() external view returns (address[] memory) {
        return lendingContracts;
    }

    function receiveEth() external  payable  {}

    receive() external payable {}

    fallback() external payable {}

     function getBalance() external view returns (uint256) {
        return address(this).balance;
    }
}