import seedRandom from 'seed-random';

export function seedIsInSample (seed, percent) {
	const randomNumberGenerator = seedRandom(seed);
	const pseudoRandomNumber = randomNumberGenerator();

	return Math.round(pseudoRandomNumber * 100) <= percent;
}
