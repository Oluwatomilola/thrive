;; @clarity-version 4

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;; Constants & Errors
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;


(define-constant ERR-NO-STAKE (err u100))
(define-constant ERR-INVALID-AMOUNT (err u101))

(define-constant REWARD_PERCENT u10) ;; 10% reward

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;; Storage
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;

(define-map stakes
  { staker: principal }
  { amount: uint }
)

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;; Read-only Functions
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;

(define-read-only (get-stake (user principal))
  (default-to u0 (get amount (map-get? stakes { staker: user })))
)

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;; Public Functions
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;

(define-public (stake (amount uint))
  (begin
    ;; Validate amount
    (asserts! (> amount u0) ERR-INVALID-AMOUNT)

    ;; Transfer STX from user to contract
    (try! (stx-transfer? amount tx-sender (as-contract tx-sender)))

    ;; Update stake balance
    (let ((current (get-stake tx-sender)))
      (map-set stakes
        { staker: tx-sender }
        { amount: (+ current amount) }
      )
    )

    ;; Emit Chainhook-friendly event
    (print {
      event: "stake",
      user: tx-sender,
      amount: amount,
      block: block-height
    })

    (ok true)
  )
)

(define-public (unstake)
  (let ((staked (get-stake tx-sender)))
    (asserts! (> staked u0) ERR-NO-STAKE)

    (let (
      (reward (/ (* staked REWARD_PERCENT) u100))
      (total (+ staked reward))
    )

      ;; Clear stake record
      (map-delete stakes { staker: tx-sender })

      ;; Send funds back to user
      (try! (as-contract (stx-transfer? total tx-sender)))

      ;; Emit Chainhook event
      (print {
        event: "unstake",
        user: tx-sender,
        amount: total,
        block: block-height
      })

      (ok total)
    )
  )
)
