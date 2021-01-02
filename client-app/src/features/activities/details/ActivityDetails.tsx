import { observer } from 'mobx-react-lite';
import React, { useContext, useEffect } from 'react'
import { RouteComponentProps } from 'react-router-dom';
import { Grid } from 'semantic-ui-react'
import { LoadingComponent } from '../../../app/layout/LoadingComponent';
import ActivityStore from '../../../app/stores/activityStore';
import { ActivityDetailChat } from './ActivityDetailChat';
import { ActivityDetailHeader } from './ActivityDetailHeader';
import { ActivityDetailInfo } from './ActivityDetailInfo';
import { ActivityDetailSidebar } from './ActivityDetailSidebar';

interface DetailParams {
    id: string;
}

export const ActivityDetails: React.FC<RouteComponentProps<DetailParams>> = observer(({
    match,
    history}) => {
    const activityStore = useContext(ActivityStore);
    const {activity, loadActivity, loadingInitial} = activityStore;

    useEffect(() => {
        loadActivity(match.params.id);
    }, [loadActivity, match.params.id])
        
    if (loadingInitial || !activity) return <LoadingComponent content='Loading activity...' />

    return (
          <Grid>
              <Grid.Column width={10}>
                  <ActivityDetailHeader activity={activity} />
                  <ActivityDetailInfo activity={activity}/>
                  <ActivityDetailChat />
              </Grid.Column>
              <Grid.Column width={6}>
                <ActivityDetailSidebar />
              </Grid.Column>
          </Grid>
    )
})
