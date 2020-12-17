import React, { FormEvent, useState } from 'react'
import { Button, Form, Segment } from 'semantic-ui-react'
import { IActivity } from '../../../app/models/activity'
import {v4 as uuid} from 'uuid';

interface IProps {
    setEditMode: (editMode: boolean) => void;
    activity: IActivity;
    createActivity: (activity: IActivity) => void;
    editActivity: (activity: IActivity) => void;
    submitting: boolean;
}

export const ActivityForm: React.FC<IProps> = ({
    setEditMode, 
    activity: currentActivity,
    createActivity,
    editActivity,
    submitting}) => {
    const initializeForm = () => {
        if (currentActivity) {
            return currentActivity;
        } else {
            return {
                id: '',
                title: '',
                description: '',
                category: '',
                date: '',
                city: '',
                venue: ''                
            }
        }
    };

    const [activity, setActivity] = useState(initializeForm);

    const handleInputChange = (event: FormEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const {name, value} = event.currentTarget;
        setActivity({...activity, [name]: value});
    };

    const handleSubmit = () => {
        if (activity.id) {
            editActivity(activity);
        } else {
            const newActivity = {
                ...activity,
                id: uuid()
            };
            createActivity(newActivity);
        }
    };

    return (
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
                <Button floated='right' type='button' content='Cancel' onClick={() => setEditMode(false)}/>
            </Form>
        </Segment>
    )
}
