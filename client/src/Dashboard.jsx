import React, { useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { Link } from 'react-router-dom';
import { db } from './firebase';
import { collection, query, where, getDocs, doc } from 'firebase/firestore';
import NicknameWidget from './NicknameWidget';

const Dashboard = () => {
    const { currentUser, logout } = useAuth();
    const [leagues, setLeagues] = useState([]);

    useEffect(() => {
        const fetchLeagues = async () => {
            if (currentUser) {
                try {
                    // Get the user document reference
                    const userRef = doc(db, 'users', currentUser.uid);
                    // Get the leagues collection reference
                    const leaguesRef = collection(db, 'leagues');
                    // Get the leagues where the user is a member
                    const q = query(leaguesRef, where('users', 'array-contains', userRef));
                    // Get the document references for each league
                    const querySnapshot = await getDocs(q);
                    // Map the leagues to an array
                    const leaguesList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                    // Set the leagues in state
                    setLeagues(leaguesList);
                } catch (error) {
                    console.error('Error fetching leagues: ', error);
                }
            }
        };

        fetchLeagues();
    }, [currentUser.uid]);

    return (
        <div>
            <h2>Welcome, {currentUser.email}</h2>
            <button onClick={logout}>Logout</button>
            <nav>
                <Link to="/create-league">Create a League</Link>
                <Link to="/join-league">Join a League</Link>
            </nav>
            <NicknameWidget />
            <h3>Your Leagues</h3>
            <ul>
                {leagues.map(league => (
                    <li key={league.id}>
                        <Link to={`/league/${league.id}`}>{league.name}</Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Dashboard;