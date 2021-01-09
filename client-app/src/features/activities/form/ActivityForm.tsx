import React, { useContext, useEffect, useState } from 'react'
import { Button, Form, Grid, Segment } from 'semantic-ui-react'
import {v4 as uuid} from 'uuid';
import ActivityStore from '../../../app/stores/activityStore';
import { observer } from 'mobx-react-lite';
import { RouteComponentProps } from 'react-router-dom';
import { Form as FinalForm, Field } from 'react-final-form';
import { TextInput } from '../../../app/common/form/TextInput';
import { TextAreaInput } from '../../../app/common/form/TextAreaInput';
import { SelectInput } from '../../../app/common/form/SelectInput';
import { category } from '../../../app/common/options/categoryOptions';
import { DateInput } from '../../../app/common/form/DateInput';
import { ActivityFormValues } from '../../../app/models/activity';
import { combineDateAndTime } from '../../../app/common/util/util';
import { combineValidators, composeValidators, hasLengthGreaterThan, isRequired } from 'revalidate';

const validate = combineValidators({
    title: isRequired({message: 'The event title is required.'}),
    category: isRequired('Category'),
    description: composeValidators(
        isRequired('Description'),
        hasLengthGreaterThan(4)({message: 'Description needs to be at least 5 characters.'})
    )(),
    city: isRequired('City'),
    venue: isRequired('Venue'),
    date: isRequired('Date'),
    time: isRequired('Time')
});

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
        submitting
    } = activityStore;

    const [activity, setActivity] = useState(new ActivityFormValues());
    const [loading, setLoading] = useState(false);
        
    const handleFinalFormSubmit = (values: any) => {
        const dateAndTime = combineDateAndTime(values.date, values.time);
        const {date, time, ...activity} = values;
        activity.date = dateAndTime;
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
        if (match.params.id) {
            setLoading(true);
            loadActivity(match.params.id)
                .then((activity) => setActivity(new ActivityFormValues(activity)))
                .finally(() => setLoading(false));
        }       

    }, [loadActivity, match.params.id]);

    return (
        <Grid>
            <Grid.Column width={10}>
            <Segment clearing>
                <FinalForm validate={validate}
                    initialValues={activity}
                    onSubmit={handleFinalFormSubmit}
                    render={({handleSubmit, invalid, pristine}) => (
                        <Form onSubmit={handleSubmit} loading={loading}>
                            <Field placeholder='Title' value={activity.title} 
                                name='title' component={TextInput} />
                            <Field placeholder='Description' value={activity.description} rows={3}
                                name='description' component={TextAreaInput} />
                            <Field placeholder='Category' value={activity.category}
                                name='category' component={SelectInput} options={category} />
                            <Form.Group widths='equal'>
                                <Field placeholder='Date' value={activity.date}
                                    name='date' component={DateInput} date={true}/>
                                <Field placeholder='Time' value={activity.date}
                                    name='time' component={DateInput} time={true}/>
                            </Form.Group>                            
                            <Field placeholder='City' value={activity.city}
                                name='city' component={TextInput} />
                            <Field placeholder='Venue' value={activity.venue}
                                name='venue' component={TextInput} />
                            <Button floated='right' positive type='submit' content='Submit' 
                                loading={submitting} disabled={loading || invalid || pristine}/>
                            <Button floated='right' type='button' content='Cancel' 
                                disabled={loading} onClick={() => activity.id ? 
                                    history.push(`/activities/${activity.id}`): history.push('/activities')}/>
                        </Form>
                    )}
                />                
            </Segment>
        </Grid.Column>
        </Grid>
    )
})
