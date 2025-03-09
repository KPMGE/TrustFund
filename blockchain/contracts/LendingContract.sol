// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract LendingContract {
    address public borrower;
    address public lender;
    uint256 public loanAmount;
    uint256 public interestRate; // In basis points (e.g., 500 = 5%)
    uint256 public repaymentPeriod; // In seconds
    uint256 public dueDate;
    bool public isRepaid;

    event LoanFunded(address indexed lender, uint256 amount);
    event LoanRepaid(address indexed borrower, uint256 amount);

    constructor(
        address _borrower,
        uint256 _loanAmount,
        uint256 _interestRate,
        uint256 _repaymentPeriod
    ) {
        borrower = _borrower;
        loanAmount = _loanAmount;
        interestRate = _interestRate;
        repaymentPeriod = _repaymentPeriod;
        dueDate = block.timestamp + _repaymentPeriod;
        isRepaid = false;
    }

    function fundLoan() external payable {
        require(msg.sender != borrower, "Borrower cannot fund their own loan");
        require(msg.value == loanAmount, "Incorrect loan amount");
        lender = msg.sender;
        emit LoanFunded(lender, msg.value);
    }

    function repayLoan() external payable {
        require(msg.sender == borrower, "Only the borrower can repay the loan");
        require(!isRepaid, "Loan is already repaid");

        uint256 totalRepayment = loanAmount + (loanAmount * interestRate) / 10000;
        require(msg.value >= totalRepayment, "Insufficient repayment amount");

        isRepaid = true;
        payable(lender).transfer(totalRepayment);
        emit LoanRepaid(borrower, totalRepayment);
    }

    function receiveEth() external  payable  {}

     function isDueDate() public view returns (bool) {
        return block.timestamp >= dueDate;
    }

    receive() external payable {}

    fallback() external payable {}

    function getBalance() external view returns (uint256) {
        return address(this).balance;
    }
}