# AnimeSwap Airdrop

`ANI` is AnimeSwap native token.

`ANI` airdrop including two parts, one is for AnimeSwap early backers
(Discord OG roles), the other is for Aptos Mainnet liquidity provider.

* OG Address List is still in binding and registering
* [Liquidity Provider Address List](./LP_snapshot_address.txt): 601 address

## Snapshot description
The snapshot calculation is based on the liquidity provider and their total value locked (TVL) in the Aptos Mainnet.

The snapshot time range
* Start: Aptos Mainnet `version 2484089`, as soon as AnimeSwap protocol launch on Aptos Mainnet, 2022-10-19 03:28:16 UTC
* End: Aptos Mainnet `version 14400000`, 2022-10-27 06:02:10 UTC

The validated pair of snapshot is Top 10 TVL pair at snapshot end time:

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
```

For non APT pair, 10 USD equals to 1 APT weight

Each address contribution is calculated by the following formula:

```
Address Contribution = Sigma(T, (Address TVL in Top 10 Pair) * delta(T))
```

Total contribution formula:
```
Total Contribution = Sigma(T, (Top 10 pair TVL) * delta(T))
```

Each address `ANI` airdrop formula:
```
Address ANI = (Total ANI Airdrop for LP) * (Address Contribution) / (Total Contribution)
```

There are more than 5000 addresses in upper formula, most of them are too small contributions. The snapshot takes `1 APT * 7 days` as threshold for minimum contribution.

Finally, the snapshot get 601 individual addresses for ANI airdrop.

## ANI Tokenomic
The full tokenomics documents is in polish stage.