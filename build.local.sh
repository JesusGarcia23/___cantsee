#!/bin/bash
# Ask the user for their name
echo Hello, which migration should I run?
read name
npx hardhat run scripts/$name.js --network localhost
echo "...loading"
echo "Done!"