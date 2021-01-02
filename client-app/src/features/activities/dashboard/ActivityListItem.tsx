import React from 'react';
import { Button,  Icon,  Item, Segment } from 'semantic-ui-react'
import { Link } from 'react-router-dom';
import { IActivity } from '../../../app/models/activity';

export const ActivityListItem: React.FC<{activity: IActivity}> = ({activity}) => {    
    return (
        <Segment.Group>
            <Segment>
                <Item.Group>
                    <Item>
                        <Item.Image size='tiny' circular src='/assets/user.png' />       
                        <Item.Content>
                            <Item.Header as='a'>{activity.title}</Item.Header>                        
                            <Item.Description>
                                Hosted by Bob                                   
                            </Item.Description>                        
                        </Item.Content>
                    </Item>
                </Item.Group>                
            </Segment>
            <Segment>
                <Icon name='clock' /> {activity.date}&nbsp;
                <Icon name='marker' /> {activity.venue}, {activity.city}
            </Segment>
            <Segment secondary>
                Attendees will go here
            </Segment>
            <Segment clearing>
                <span>{activity.description}</span>
                <Button floated='right' content='View' color='blue' 
                        as={Link} to={`/activities/${activity.id}`}/> 
            </Segment>
        </Segment.Group>        
    )
}