import React, { FormEvent, useContext, useEffect, useState } from 'react'
import { Button, Form, Grid, Segment } from 'semantic-ui-react'
import {v4 as uuid} from 'uuid';
import ActivityStore from '../../../app/stores/activityStore';
import { observer } from 'mobx-react-lite';
import { RouteComponentProps } from 'react-router-dom';

interface DetailParams {    
    id: string;        
}

export const ActivityForm: React.FC<RouteComponentProps<DetailParams>> = observer(({
    match,
    history
    }) => {
    const activityStore = useContext(ActivityStore);
    const {
        createActivity, 
        editActivity, 
        loadActivity,
        clearActivity,        
        submitting, 
        activity: currentActivity
    } = activityStore;

    const [activity, setActivity] = useState({
        id: '',
        title: '',
        description: '',
        category: '',
        date: '',
        city: '',
        venue: ''                
    });

    const handleInputChange = (event: FormEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const {name, value} = event.currentTarget;
        setActivity({...activity, [name]: value});
    };

    const handleSubmit = () => {
        if (activity.id) {
            editActivity(activity).then(() => history.push(`/activities/${activity.id}`));
        } else {
            const newActivity = {
                ...activity,
                id: uuid()
            };
            createActivity(newActivity).then(() => history.push(`/activities/${newActivity.id}`));
        }
    };

    useEffect(() => {        
        if (!activity.id && match.params.id) {
            loadActivity(match.params.id).then(() => {
                currentActivity && setActivity(currentActivity);
            });
        }

        return () => {
            clearActivity();
        };

    }, [loadActivity, clearActivity, match.params.id, currentActivity, activity.id]);

    return (
        <Grid>
            <Grid.Column width={10}>
            <Segment clearing>
                <Form onSubmit={handleSubmit}>
                    <Form.Input placeholder='Title' value={activity.title} 
                        name='title' onChange={handleInputChange}/>
                    <Form.TextArea placeholder='Description' rows={2} value={activity.description}
                        name='description' onChange={handleInputChange}/>
                    <Form.Input placeholder='Category' value={activity.category}
                        name='category' onChange={handleInputChange}/>
                    <Form.Input placeholder='Date' type='datetime-local' value={activity.date}
                        name='date' onChange={handleInputChange}/>
                    <Form.Input placeholder='City' value={activity.city}
                        name='city' onChange={handleInputChange}/>
                    <Form.Input placeholder='Venue' value={activity.venue}
                        name='venue' onChange={handleInputChange}/>
                    <Button floated='right' positive type='submit' content='Submit' loading={submitting}/>
                    <Button floated='right' type='button' content='Cancel' onClick={() => history.push('/activities')}/>
                </Form>
            </Segment>
        </Grid.Column>
        </Grid>
    )
})
