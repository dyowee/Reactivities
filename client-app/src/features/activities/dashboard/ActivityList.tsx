import React, { useContext } from 'react'
import { Button,  Item, Label, Segment } from 'semantic-ui-react'
import { observer } from 'mobx-react-lite';
import ActivityStore from '../../../app/stores/activityStore';

export const ActivityList: React.FC = observer(() => {
    const activityStore = useContext(ActivityStore);
    const {activitiesByDate, submitting, target, selectActivity, deleteActivity} = activityStore;
    return (
        <Segment clearing>
            <Item.Group divided>
                {
                    activitiesByDate.map((activity) => (
                        <Item key={activity.id}>            
                            <Item.Content>
                                <Item.Header as='a'>{activity.title}</Item.Header>
                                <Item.Meta>{activity.date}</Item.Meta>
                                <Item.Description>
                                    <div>{activity.description}</div>                    
                                    <div>{activity.city}, {activity.venue}</div>                                   
                                </Item.Description>
                                <Item.Extra>
                                    <Button floated='right' content='View' color='blue' 
                                        onClick={() => selectActivity(activity.id)}/>
                                    <Button floated='right' content='Delete' color='red' 
                                        name={activity.id}
                                        onClick={(ev) => deleteActivity(activity.id, ev.currentTarget.name)}
                                        loading={target === activity.id && submitting}/>
                                    <Label basic content={activity.category}/>
                                </Item.Extra>
                            </Item.Content>
                        </Item>
                    ))
                }                               
            </Item.Group>
        </Segment>        
    )
})
