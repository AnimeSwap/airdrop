# AnimeSwap Airdrop

`ANI` is AnimeSwap native token.

`ANI` airdrop including two parts, one is for AnimeSwap community early backers
(Discord OG roles), the other is for Aptos Mainnet liquidity provider.

* [OG Bind Address List](./OG_bind_address.txt): 935 addresses
* [Liquidity Provider Address List](./LP_snapshot_address.txt): 1001 addresses

## Snapshot description
The snapshot calculation is based on the liquidity provider and their total value locked (TVL) in the Aptos Mainnet.

The snapshot time range
* Start: Aptos Mainnet `version 2484089`, as soon as AnimeSwap protocol launch on Aptos Mainnet, 2022-10-19 03:28:16 UTC
* End: Aptos Mainnet `version 14400000`, 2022-10-27 06:02:10 UTC

The validated pair of snapshot is Top 12 TVL pairs at snapshot end time:

```
APT/tAPT
APT/zUSDC
APT/whWBTC
APT/zWETH
APT/whWETH
APT/whUSDC
APT/stAPT
APT/zUSDT
zUSDC/zUSDT
USDA/zUSDT
APT/MOJO
whUSDC/zUSDC
```

For non APT pair, 10 USD equals to 1 APT weight

Each address contribution is calculated by the following formula:

```
Address Contribution = Sigma(T, (Address TVL in Top 12 Pair) * delta(T))
```

Total contribution formula:
```
Total Contribution = Sigma(T, (Top 12 pair TVL) * delta(T))
```

Each address `ANI` airdrop formula:
```
Address ANI = (Total ANI Airdrop for LP) * (Address Contribution) / (Total Contribution)
```

There are more than 5000 addresses in upper formula, most of them are too small contributions. The snapshot takes `0.5 APT * 7 days` as threshold for minimum contribution.

Finally, the snapshot get 1001 individual addresses for ANI airdrop.

## ANI Tokenomic
The full tokenomics documents is in polish stage.