import { useState } from "react"

const ARRLEN = 25
const NUMROWS = 5
const NUMCOLS = 5
const CHARSTR = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
const CHARLIST = Array.from(CHARSTR)

export default function Decrypt() {
	const [cypherSecret, setCypherSecret] = useState<string>("")
	const [cypheredMessage, setCypheredMessage] = useState<string>("")

	const cypherMatrix = Array(ARRLEN).fill("") as string[]

	Array.from(cypherSecret.toUpperCase()).forEach((secretChar) => {
		const matrixIndex = getMatrixIndexOfChar(secretChar)
		if (matrixIndex === -1) {
			// The current character does not exist in the matrix
			const lastInsertionIndex = cypherMatrix.findIndex((mtxElem) => {
				return mtxElem === ""
			})
			if (lastInsertionIndex === -1) {
				// This condition should never arise
			} else {
				cypherMatrix[lastInsertionIndex] = secretChar
			}
		} else {
			// The current character exists, ignore
		}
	})

	CHARLIST.forEach((fillChar) => {
		const matrixIndex = getMatrixIndexOfChar(fillChar)
		if (matrixIndex === -1) {
			// The current character does not exist in the matrix
			const lastInsertionIndex = cypherMatrix.findIndex((mtxElem) => {
				return mtxElem === ""
			})
			if (lastInsertionIndex === -1) {
				// This condition should never arise
			} else {
				cypherMatrix[lastInsertionIndex] = fillChar
			}
		} else {
			// The current character exists, ignore
		}
	})

	const nullChar = cypherMatrix[ARRLEN - 1]

	function getMatrixIndexOfChar(char: string) {
		if (char.toUpperCase() === char) {
			if (char === "J" || char === "I") {
				const jIndex = cypherMatrix.indexOf("J")
				const iIndex = cypherMatrix.indexOf("I")
				if (jIndex === -1 && iIndex === -1) {
					return -1
				}
				return Math.max(...[jIndex, iIndex])
			}
			return cypherMatrix.indexOf(char)
		}

		return getMatrixIndexOfChar(char.toUpperCase())
	}

	function splitIndex(index: number) {
		return [(index - (index % 5)) / 5, index % 5] as const
	}

	function getDecypheredString(inputString: string) {
		let decypheredString = ""

		for (let inputIdx = 0; inputIdx < inputString.length; inputIdx += 2) {
			let [leftChar, rightChar] = [
				inputString[inputIdx],
				inputString[inputIdx + 1],
			]
			const leftIdx = getMatrixIndexOfChar(leftChar)
			const rightIdx = getMatrixIndexOfChar(rightChar)
			if (leftIdx === -1 || rightIdx === -1) {
				decypheredString += "??"
			}

			let [leftRow, leftCol] = splitIndex(leftIdx)
			let [rightRow, rightCol] = splitIndex(rightIdx)

			if (leftRow === rightRow) {
				// Case 1: Same Row, Shift Behind
				leftCol = (leftCol + -1 + NUMCOLS) % NUMCOLS
				rightCol = (rightCol - 1 + NUMCOLS) % NUMCOLS
				leftChar = cypherMatrix[leftRow * NUMCOLS + leftCol]
				rightChar = cypherMatrix[rightRow * NUMCOLS + rightCol]
			} else if (leftCol === rightCol) {
				// Case 2: Same Col, Shift Down
				leftRow = (leftRow - 1 + NUMROWS) % NUMROWS
				rightRow = (rightRow - 1 + NUMROWS) % NUMROWS
				leftChar = cypherMatrix[leftRow * NUMCOLS + leftCol]
				rightChar = cypherMatrix[rightRow * NUMCOLS + rightCol]
			} else {
				leftChar = cypherMatrix[leftRow * NUMCOLS + rightCol]
				rightChar = cypherMatrix[rightRow * NUMCOLS + leftCol]
			}

			decypheredString += `${leftChar}${rightChar}`
		}

		return decypheredString
	}

	return (
		<div
			className={
				"flex flex-col items-center justify-between gap-16 lg:flex-row lg:gap-32"
			}
		>
			<div className={"grid grid-cols-5 grid-rows-5 gap-0 border"}>
				{Array(NUMROWS)
					.fill(undefined)
					.map((_ignoreRow, rowIdx) => {
						return (
							<>
								{Array(NUMCOLS)
									.fill(undefined)
									.map((_ignoreCol, colIdx) => {
										const mtxChar =
											cypherMatrix[rowIdx * 5 + colIdx]
										return (
											<div
												className={
													"flex aspect-square items-center justify-center border p-4"
												}
												style={{
													backgroundColor:
														cypherSecret.includes(
															mtxChar,
														)
															? "yellow"
															: "",
												}}
											>
												{mtxChar}
											</div>
										)
									})}
							</>
						)
					})}
			</div>
			<form
				onSubmit={(e) => {
					e.preventDefault()
					e.stopPropagation()
				}}
				className={"flex flex-col items-start justify-between gap-4"}
			>
				<label htmlFor={"cypherSecret"}>Cypher Secret</label>
				<input
					id={"cypherSecret"}
					type={"text"}
					value={cypherSecret}
					onChange={(e) => {
						setCypherSecret(
							Array.from(e.target.value.toUpperCase())
								.filter((newChar) => {
									return CHARLIST.includes(newChar)
								})
								.join(""),
						)
					}}
					className={"rounded border p-2"}
				/>
				<label htmlFor={"cypheredMessage"}>Cyphered Message</label>
				<input
					id={"cypheredMessage"}
					type={"text"}
					value={cypheredMessage}
					onChange={(e) => {
						setCypheredMessage(
							Array.from(e.target.value.toUpperCase())
								.filter((newChar) => {
									return CHARLIST.includes(newChar)
								})
								.join(""),
						)
					}}
					className={"rounded border p-2"}
				/>
				<label htmlFor={"decypheredMessage"}>Decyphered Message</label>
				<input
					id={"decypheredMessage"}
					type={"text"}
					value={getDecypheredString(cypheredMessage)}
					readOnly
					className={"rounded border p-2"}
				/>
			</form>
		</div>
	)
}
