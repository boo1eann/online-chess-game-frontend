export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api/v1';

export const ENDPOINTS = {
	AUTH: {
		LOGIN: '/auth/login',
		REGISTER: '/auth/register',
		REFRESH: '/auth/refresh',
		LOGOUT: '/auth/logout',
		GUEST: '/auth/guest',
		CONVERT_GUEST: '/auth/convert-guest',
		GOOGLE_MOBILE: '/auth/google/mobile',
		APPLE_MOBILE: '/auth/apple/mobile',
	},
	GAME: {
		CREATE_MATCH: '/game/matches',
		JOIN_MATCH: '/game/matches/join',
		GET_MATCH: (matchId: string) => `/game/matches/${matchId}`,
		MAKE_MOVE: (matchId: string) => `/game/matches/${matchId}/move`,
		RESIGN: (matchId: string) => `/game/matches/${matchId}/resign`,
		OFFER_DRAW: (matchId: string) => `/game/matches/${matchId}/offer-draw`,
	},
	PLAYER: {
		GET_PROFILE: '/player/profile',
		UPDATE_PROFILE: '/player/profile',
		GET_LEADERBOARD: '/player/leaderboard',
	},
};