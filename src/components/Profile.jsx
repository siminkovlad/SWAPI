import React from 'react';

export const Profile = ({
    avatarUrl,
    character,
    like,
    dlike,
    onLike,
    onBack,
    getPlanet,
    setAvatar
}) => {
    const {
        name,
        homeworld,
        gender,
        height,
        mass,
        hair_color,
        skin_color,
        eye_color,
        birth_year,
        films,
        vehicles
    } = character;

    return (
        <div className="profile">
            <div className="name">{name}</div>
            {avatarUrl && <img src={avatarUrl} alt="Avatar" />}
            <h3>Main information</h3>
            <div>Planet: {getPlanet(homeworld)}</div>
            <div>Gender: {gender}</div>
            <div>Height: {height}</div>
            <div>Mass: {mass}</div>
            <div>Hair color: {hair_color}</div>
            <div>Skin color: {skin_color}</div>
            <div>Eye color: {eye_color}</div>
            <div>Birth year: {birth_year}</div>
            <h3>Films</h3>
            <div>{films.join(' | ')}</div>
            <h3>Vehicles</h3>
            <div>{vehicles.join(' | ') || 'No info :('}</div>
            <div className="avatar-input">
                Change profile avatar: <input placeholder="Copy url here" onChange={setAvatar} />
            </div>
            <div className="rating">
                <button id="like" onClick={onLike}>Like</button>
                <span className="likes">+{like}</span> | <span className="dislikes">{dlike}</span>
                <button id="dislike" onClick={onLike}>Dislike</button>
            </div>
            <button className="back" onClick={onBack}>Back</button>
        </div>
    );
};
