import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Autocomplete } from '@material-ui/lab';
import { TextField } from '@material-ui/core';
import Pagination from '@material-ui/lab/Pagination';

import { Profile } from './Profile';
import { Loader } from './Loader';

import { fetchData, fetchFilms } from '../store';

export const App = () => {
    const [page, setPage] = useState(1);
    const [selectedCharacter, setSelectedCharacter] = useState(null);
    const [likes, setLikes] = useState(0);
    const [dislikes, setDislikes] = useState(0);
    const [avatar, setAvatar] = useState(null);
    const {
        people,
        planets,
        films,
        loading
    } = useSelector(state => state);
    const dispatch = useDispatch();

    const numberOfPages = Math.ceil((people.count - 1) / 10);

    useEffect(() => {
        dispatch(fetchData());
        dispatch(fetchFilms());
    }, []);

    useEffect(() => {
        const localStorageData = (selectedCharacter?.name && localStorage.getItem(selectedCharacter.name)) || [];

        if (localStorageData.length) {
            const data = localStorageData.split('|');

            setLikes(data[0]);
            setDislikes(data[1]);
            setAvatar(data[2] !== 'undefined' ? data[2] : '');
        } else {
            setLikes(0);
            setDislikes(0);
            setAvatar(null);
        }
    }, [selectedCharacter]);

    const paginationHandler = (e, value) => {
        dispatch(fetchData(value));
        setPage(value);
    };

    const imgHandler = e => {
        const avatarURL = e.target.value;
        const localStorageData = localStorage.getItem(selectedCharacter.name)?.split('|') || [];
        const data = localStorageData.length ? `${localStorageData[0]}|${localStorageData[1]}` : '0|0';

        localStorage.setItem(selectedCharacter.name, `${data}|${avatarURL}`);
        setAvatar(avatarURL);

        e.target.value = '';
    };

    const findPlanet = homeworld => {
        let result = '';

        planets.map(i => {
            if (i[0] === homeworld) result = i[1];
        });

        return result;
    };

    const likesHandler = e => {
        const type = e.target.id;
        let newValue;

        if (!localStorage.getItem(selectedCharacter.name)) localStorage.setItem(selectedCharacter.name, '0|0');

        const localStorageData = localStorage.getItem(selectedCharacter.name).split('|');

        if (type === 'like') {
            newValue = (+localStorageData[0] + 1);

            setLikes(newValue);
            localStorage.setItem(selectedCharacter.name, `${newValue}|${localStorageData[1]}|${localStorageData[2]}`);
        } else {
            newValue = (+localStorageData[1] - 1);

            setDislikes(newValue);
            localStorage.setItem(selectedCharacter.name, `${localStorageData[0]}|${newValue}|${localStorageData[2]}`);
        }
    };

    const autoCompHandler = async e => {
        if (!e.target.innerText) return setSelectedCharacter(null);

        const character = people.results.find(i => i.name === e.target.innerText);
        const filmsTitle = [];

        character.films.map(film => {
            films.map(i => {
                if (i.url === film) filmsTitle.push(i.title);
            });
        });

        if (filmsTitle.length) character.films = filmsTitle;

        const vehicles = [];

        for (let i = 0; i < character.vehicles.length; i++) {
            if (/http/.test(character.vehicles[i])) {
                const resp = await fetch(character.vehicles[i]).then(data => data.json());

                vehicles.push(resp.name);
            }
        }

        if (vehicles.length) character.vehicles = vehicles;

        setSelectedCharacter(character);
    };

    const backHandler = () => setSelectedCharacter(null);

    if (loading) return <Loader/>;

    return (
        <div className="wrapper">
            <Autocomplete
                id="search-input"
                options={people.results}
                onChange={autoCompHandler}
                getOptionLabel={option => option.name}
                style={{ width: '320px', marginTop: '1rem' }}
                renderInput={params => <TextField {...params} label="Select character" variant="outlined" />}
            />
            {
                selectedCharacter ?
                    <Profile
                        avatarUrl={avatar}
                        character={selectedCharacter}
                        like={likes}
                        dlike={dislikes}
                        onLike={likesHandler}
                        onBack={backHandler}
                        getPlanet={findPlanet}
                        setAvatar={imgHandler}
                    /> : (
                        <>
                            <ol>
                                {people.results.map((i, index) => {
                                    return (
                                        <div key={index} className="character-item">
                                            <div>
                                                <span className="character-name" onClick={autoCompHandler}>{i.name}</span>
                                            </div>
                                            <span>Gender: {i.gender} | Planet: {findPlanet(i.homeworld)}</span>
                                        </div>
                                    );
                                })}
                            </ol>
                            <Pagination
                                count={numberOfPages}
                                page={page}
                                variant="outlined"
                                color="primary"
                                onChange={paginationHandler}
                            />
                        </>
                    )
            }
        </div>
    );
};
