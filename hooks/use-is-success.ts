"use client"

import { useState, useEffect } from "react"

/**
 * A hook that determines if an operation was successful
 * @param status The status of the operation
 * @param successStatus The status that indicates success (default: 'success')
 * @returns A boolean indicating if the operation was successful
 */
export function useIsSuccess(status: string | undefined, successStatus = "success"): boolean {
    const [isSuccess, setIsSuccess] = useState<boolean>(false)

    useEffect(() => {
        if (status === successStatus) {
            setIsSuccess(true)
        } else {
            setIsSuccess(false)
        }
    }, [status, successStatus])

    return isSuccess
}

export default useIsSuccess

