import React, { useState } from "react"
import Decrypt from "../components/Decrypt"
import Encrypt from "../components/Encrypt"

type Mode = "encrypt" | "decrypt"

export default function Home() {
	const [codeMode, setCodeMode] = useState<Mode>("encrypt")

	const modeMapping: Record<Mode, React.ReactNode> = {
		decrypt: <Decrypt />,
		encrypt: <Encrypt />,
	}

	return (
		<div
			className={
				"flex min-h-screen min-w-screen flex-col items-center justify-center gap-8"
			}
		>
			<form className={"flex flex-grow-0 flex-row gap-4"}>
				<label htmlFor={"encrypt"}>Encrypt</label>
				<input
					type={"radio"}
					value={"encrypt"}
					id={"encrypt"}
					onChange={(e) => {
						setCodeMode(e.target.value as Mode)
					}}
					checked={codeMode === "encrypt"}
				/>
				<label htmlFor={"decrypt"}>Decrypt</label>
				<input
					type={"radio"}
					value={"decrypt"}
					id={"decrypt"}
					onChange={(e) => {
						setCodeMode(e.target.value as Mode)
					}}
					checked={codeMode === "decrypt"}
				/>
			</form>
			{modeMapping[codeMode]}
		</div>
	)
}
