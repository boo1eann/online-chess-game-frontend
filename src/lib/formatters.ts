export const formatters = {
	date: (dateString: string): string => {
		const date = new Date(dateString);
		return date.toLocaleDateString();
	},

	dateTime: (dateString: string): string => {
		const date = new Date(dateString);
		return date.toLocaleString();
	},

	number: (num: number): string => {
		return num.toLocaleString();
	},

	percentage: (num: number, decimals: number = 1): string => {
		return `${num.toFixed(decimals)}%`;
	},

	winRate: (wins: number, total: number): string => {
		if (total === 0) return '0%';
		const rate = (wins / total) * 100;
		return `${rate.toFixed(1)}%`;
	},

	rating: (rating: number): string => {
		return rating.toString();
	},

	timeLeft: (milliseconds: number): string => {
		const totalSeconds = Math.floor(milliseconds / 1000);
		const minutes = Math.floor(totalSeconds / 60);
		const seconds = totalSeconds % 60;
		return `${minutes}:${seconds.toString().padStart(2, '0')}`;
	},
};