import { Button, Container, Heading } from "@chakra-ui/react";
import {serialize, useContractWrite, useWalletClient} from "wagmi";
import { usePermit } from "wagmi-permit";
import {parseAbi, zeroAddress, zeroHash} from "viem";
import { ConnectButton } from "@rainbow-me/rainbowkit";

function App() {
	const { data: walletClient } = useWalletClient();
	const { signPermit, signature, error } = usePermit({
		walletClient,
		ownerAddress: walletClient?.account.address ?? zeroAddress,
		chainId: walletClient?.chain.id,
		spenderAddress: "0x5f390415dB0f7d4D336095f3Fd266D6B3B616e7A", // vitalik.eth
		contractAddress: "0x3355df6D4c9C3035724Fd0e3914dE96A5a83aaf4", // usdc
	});

	const {write} = useContractWrite({
		address: "0x3355df6D4c9C3035724Fd0e3914dE96A5a83aaf4",
		abi:  parseAbi(["function permit(address owner,address spender,uint256 value,uint256 deadline,uint8 v,bytes32 r,bytes32 s)"]),
		functionName: 'permit',
		args: [walletClient?.account.address ?? zeroAddress, "0x5f390415dB0f7d4D336095f3Fd266D6B3B616e7A",1n,1714327012n,signature?.v ?? 0, signature?.r ?? zeroHash,signature?.s ?? zeroHash]
	});

	return (
		<Container my={3}>
			<Heading as={"h1"} mb={5}>
				Wagmi Permit Demo
			</Heading>
			<ConnectButton
				chainStatus={{ smallScreen: "full", largeScreen: "full" }}
				showBalance={{ smallScreen: true, largeScreen: true }}
				accountStatus={{ smallScreen: "full", largeScreen: "full" }}
			/>
			{error && <pre>{serialize(error, null, 2)}</pre>}
			{signature && <pre>{serialize(signature, null, 2)}</pre>}
			{walletClient && (
				<Button
					mt={3}
					onClick={async () => {
						const permitSignature = await signPermit?.({
							value: 1n,
							deadline: 1714327012n,
						});

						console.log(permitSignature);
					}}
				>
					Sign permit
				</Button>
			)}
			<Button onClick={() => {
				write?.();
			}}>Permit</Button>
		</Container>
	);
}

export default App;
