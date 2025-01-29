import { useState } from "react"

const ARRLEN = 25
const NUMROWS = 5
const NUMCOLS = 5
const CHARLIST = Array.from("ABCDEFGHIJKLMNOPQRSTUVWXYZ")

export default function App() {
	const [cypherSecret, setCypherSecret] = useState<string>("")
	const [cypherMessage, setCypherMessage] = useState<string>("")

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
			if (char === "J") {
				return getMatrixIndexOfChar("I")
			}
			return cypherMatrix.indexOf(char)
		}

		return getMatrixIndexOfChar(char.toUpperCase())
	}

	function splitIndex(index: number) {
		return [(index - (index % 5)) / 5, index % 5] as const
	}

	function getPaddedString(inputString: string) {
		const upperInput = inputString.toUpperCase()
		let targetString = ""
		Array.from(upperInput).forEach((inputChar, charIdx) => {
			if (charIdx === 0) {
				targetString += inputChar
			} else {
				if (upperInput[charIdx - 1] === inputChar) {
					targetString += `${nullChar}${nullChar}${inputChar}`
				} else {
					targetString += inputChar
				}
			}
		})

		if (targetString.length % 2) {
			targetString += nullChar
		}

		return targetString
	}

	function getCypheredString(inputString: string) {
		let cypheredString = ""

		for (let inputIdx = 0; inputIdx < inputString.length; inputIdx += 2) {
			let [leftChar, rightChar] = [
				inputString[inputIdx],
				inputString[inputIdx + 1],
			]
			const leftIdx = getMatrixIndexOfChar(leftChar)
			const rightIdx = getMatrixIndexOfChar(rightChar)
			if (leftIdx === -1 || rightIdx === -1) {
				cypheredString += "??"
			}

			let [leftRow, leftCol] = splitIndex(leftIdx)
			let [rightRow, rightCol] = splitIndex(rightIdx)

			console.log({
				leftChar,
				rightChar,
				leftIdx,
				rightIdx,
				leftRow,
				leftCol,
				rightRow,
				rightCol,
			})

			if (leftRow === rightRow) {
				// Case 1: Same Row, Shift Ahead
				leftCol = (leftCol + 1) % NUMCOLS
				rightCol = (rightCol + 1) % NUMCOLS
				leftChar = cypherMatrix[leftRow * NUMCOLS + leftCol]
				rightChar = cypherMatrix[rightRow * NUMCOLS + rightCol]
			} else if (leftCol === rightCol) {
				// Case 2: Same Col, Shift Down
				leftRow = (leftRow + 1) % NUMROWS
				rightRow = (rightRow + 1) % NUMROWS
				leftChar = cypherMatrix[leftRow * NUMCOLS + leftCol]
				rightChar = cypherMatrix[rightRow * NUMCOLS + rightCol]
			} else {
				leftChar = cypherMatrix[leftRow * NUMCOLS + rightCol]
				rightChar = cypherMatrix[rightRow * NUMCOLS + leftCol]
			}

			cypheredString += `${leftChar}${rightChar}`
		}

		return cypheredString
	}

	return (
		<div
			className={
				"flex min-h-screen min-w-screen items-center justify-center"
			}
		>
			<div
				className={"flex flex-row items-center justify-between gap-32"}
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
												cypherMatrix[
													rowIdx * 5 + colIdx
												]
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
					className={
						"flex flex-col items-start justify-between gap-4"
					}
				>
					<label htmlFor={"cypherSecret"}>Cypher Secret</label>
					<input
						id={"cypherSecret"}
						type={"text"}
						value={cypherSecret}
						onChange={(e) => {
							setCypherSecret(
								e.target.value
									.toUpperCase()
									.split(/\s/)
									.join(""),
							)
						}}
						className={"rounded border p-2"}
					/>
					<label htmlFor={"cypherMessage"}>Cypher Message</label>
					<input
						id={"cypherMessage"}
						type={"text"}
						value={cypherMessage}
						onChange={(e) => {
							setCypherMessage(
								e.target.value
									.toUpperCase()
									.split(/\s/)
									.join(""),
							)
						}}
						className={"rounded border p-2"}
					/>
					<label htmlFor={"paddedMessage"}>Padded Message</label>
					<input
						id={"paddedMessage"}
						type={"text"}
						value={getPaddedString(cypherMessage)}
						readOnly
						className={"rounded border p-2"}
					/>
					<label htmlFor={"cypheredMessage"}>Cyphered Message</label>
					<input
						id={"cypheredMessage"}
						type={"text"}
						value={getCypheredString(
							getPaddedString(cypherMessage),
						)}
						readOnly
						className={"rounded border p-2"}
					/>
				</form>
			</div>
		</div>
	)
}
