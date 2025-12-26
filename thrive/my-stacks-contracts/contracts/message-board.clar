;; Simple Staking Contract
;; This contract allows users to stake their assets for a fee in sBTC.

;; Define contract owner
(define-constant CONTRACT_OWNER tx-sender)

;; Define error codes
(define-constant ERR-NOT-ENOUGH-BALANCE u100)
(define-constant ERR-NOTHING-TO-WITHDRAW u101)

;; Configuration
(define-constant STAKING-REWARD-PERCENT u10) ;; 10% reward

;; Data storage
(define-map stakes
  { staker: principal }
  { amount: uint }
)

;; Read-only: get stake balance
(define-read-only (get-stake (user principal))
  (default-to u0 (get amount (map-get? stakes { staker: user })))
)

;; Stake STX
(define-public (stake (amount uint))
  (begin
    (asserts! (> amount u0) ERR-NOT-ENOUGH-BALANCE)

    ;; Transfer STX from user to contract
    (try! (stx-transfer? amount tx-sender (as-contract tx-sender)))

    (let ((current (get-stake tx-sender)))
      (map-set stakes
        { staker: tx-sender }
        { amount: (+ current amount) }
      )
    )

    (ok true)
  )
)

;; Unstake + reward
(define-public (unstake)
  (let ((staked (get-stake tx-sender)))
    (asserts! (> staked u0) ERR-NOTHING-TO-WITHDRAW)

    (let (
        (reward (/ (* staked STAKING-REWARD-PERCENT) u100))
        (total (+ staked reward))
      )

      ;; Clear stake
      (map-delete stakes { staker: tx-sender })

      ;; Pay user
      (try! (as-contract (stx-transfer? total tx-sender tx-sender)))

      (ok total)
    )
  )
)
