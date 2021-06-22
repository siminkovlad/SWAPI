export const SHOW_LOADER = 'SHOW_LOADER';
export const HIDE_LOADER = 'HIDE_LOADER';
export const SET_PEOPLE = 'SET_PEOPLE';
export const SET_PLANETS = 'SET_PLANETS';
export const SET_FILMS = 'SET_FILMS';

export const showLoader = () => ({ type: SHOW_LOADER });
export const hideLoader = () => ({ type: HIDE_LOADER });
export const setPeople = payload => ({ type: SET_PEOPLE, payload });
export const setPlanets = payload => ({ type: SET_PLANETS, payload });
export const setFilms = payload => ({ type: SET_FILMS, payload });

export const initialState = {
    people: [],
    planets: [],
    films: [],
    loading: true
};

const rootReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_PEOPLE:
            return { ...state, people: action.payload };
        case SET_PLANETS:
            return { ...state, planets: action.payload };
        case SET_FILMS:
            return { ...state, films: action.payload };
        case SHOW_LOADER:
            return { ...state, loading: true };
        case HIDE_LOADER:
            return { ...state, loading: false };
        default:
            return state;
    }
};

export const fetchFilms = () => {
    return dispatch => {
        const filmsURL = `https://swapi.dev/api/films/`;

        fetch(filmsURL)
            .then(resp => resp.json())
            .then(data => dispatch(setFilms(data.results)));
    };
};

export const fetchData = (page = 1) => {
    return async dispatch => {
        dispatch(showLoader());

        const url = `https://swapi.dev/api/people/?page=${page}`;
        const planetsUrls = [];
        const planets = [];

        const resp = await fetch(url).then(data => data.json());

        resp.results.map(i => {
            if (!planetsUrls.includes(i.homeworld)) planetsUrls.push(i.homeworld);
        });

        for (let i = 0; i < planetsUrls.length; i++) {
            const resp = await fetch(planetsUrls[i]).then(resp => resp.json());

            planets.push([planetsUrls[i], resp.name]);
        }

        dispatch(setPlanets(planets));
        dispatch(setPeople(resp));
        dispatch(hideLoader());
    };
};

export default rootReducer;
