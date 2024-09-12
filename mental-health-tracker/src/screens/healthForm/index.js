import React, { useContext, useState } from 'react';
import EmojiRating from 'react-emoji-rating';
import './healthForm.css';
import axios from 'axios';
import { URLS } from '../../utils/urls';
import { AuthContext } from '../../context/AuthContext';
import { SweetAlert } from '../../context/SweetAlert';
import { useNavigate } from 'react-router-dom';

const HealthForm = () => {
    const defaultValues = {
        moodRatings: 3,
        anxietyLevel: 3,
        sleepPatterns: 4,
        physicalActivity: '',
        socialInteractions: '',
        stressLevels: '',
        symptomsDepressionAnxiety: ''
    };
    const [formValues, setFormValues] = useState(defaultValues);
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const {setSwalProps} = useContext(SweetAlert);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const headers = {
            at_token: user.at_token,
        }
        const response = await axios.post(URLS.logs, formValues, { headers });
        if (response.data.success) {
            setSwalProps({
                show: true,
                title: 'Successfull',
                text: 'Health information saved successfully',
                icon: 'success',
                didClose: () => {
                    navigate('/logs');
                }
            });
        }else{
            alert({
                show: true,
                title: 'Error!',
                text: response.data.message,
                icon: 'error'
        })
        }
    };

    const handleFormChange = (key, value) => {
        setFormValues({ ...formValues, [key]: value });
    }

    return (
        <div className="form-container">
            <h2 className="form-title">Daily Mental Health Log</h2>
            <form onSubmit={handleSubmit} className="health-form">
                <div className="form-group">
                    <label>Mood Rating</label>
                    <EmojiRating
                        onChange={(v) => {
                            handleFormChange('moodRatings', v)
                        }}
                        size={40}
                        value={formValues.moodRatings}
                        labels={['Very Sad', 'Sad', 'Neutral', 'Happy', 'Very Happy']}
                    />
                </div>

                <div className="form-group">
                    <label>Anxiety Levels</label>
                    <EmojiRating
                        onChange={(v) => {
                            handleFormChange('anxietyLevel', v)
                        }}
                        size={40}
                        value={formValues.anxietyLevel}
                        labels={['Very Calm', 'Calm', 'Neutral', 'Anxious', 'Very Anxious']}
                    />
                </div>

                <div className="form-group">
                    <label>Sleep Patterns (Hours)</label>
                    <input
                        type="number"
                        value={formValues.sleepPatterns}
                        onChange={(e) => handleFormChange('sleepPatterns', e.target.value)}
                        className="form-control"
                    />
                </div>

                <div className="form-group">
                    <label>Physical Activity</label>
                    <textarea
                        value={formValues.physicalActivity}
                        onChange={(e) => handleFormChange('physicalActivity', e.target.value)}
                        className="form-control"
                        placeholder="Describe your physical activity today..."
                    />
                </div>

                <div className="form-group">
                    <label>Social Interactions</label>
                    <textarea
                        value={formValues.socialInteractions}
                        onChange={(e) => handleFormChange('socialInteractions', e.target.value)}
                        className="form-control"
                        placeholder="Describe your social interactions today..."
                    />
                </div>

                <div className="form-group">
                    <label>Stress Levels</label>
                    <textarea
                        value={formValues.stressLevels}
                        onChange={(e) => handleFormChange('stressLevels', e.target.value)}
                        className="form-control"
                        placeholder="How stressed were you today?"
                    />
                </div>

                <div className="form-group">
                    <label>Symptoms of Depression/Anxiety</label>
                    <textarea
                        value={formValues.symptomsDepressionAnxiety}
                        onChange={(e) => handleFormChange('symptomsDepressionAnxiety', e.target.value)}
                        className="form-control"
                        placeholder="Describe any symptoms you experienced..."
                    />
                </div>

                <button type="submit" className="submit-button">Submit Log</button>
            </form>
        </div>
    );
};

export default HealthForm;
