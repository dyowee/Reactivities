import { observable, action, computed, configure, runInAction } from 'mobx';
import { createContext } from 'react';
import agent from '../api/agent';
import { IActivity } from '../models/activity';

configure({enforceActions: 'always'});

class ActivityStore {
    @observable activityRegistry = new Map();    
    @observable loadingInitial = false;
    @observable activity: IActivity | null = null;    
    @observable submitting = false;
    @observable target = '';

    @computed get activitiesByDate() {
        const activities = Array.from(this.activityRegistry.values());
        return this.groupActivitiesByDate(activities);        
    };

    groupActivitiesByDate(activities: IActivity[]) {
        return Object.entries(activities.reduce((groupedActivities, activity) => {
            const date = activity.date.split('T')[0];
            groupedActivities[date] = groupedActivities[date] ? [...groupedActivities[date], activity] : [activity];
            return groupedActivities;
        }, {} as {[key: string]: IActivity[]}));
    };

    @action loadActivities = async () => {        
        try {
            this.loadingInitial = true;
            const response = await agent.Activities.list();
            runInAction('loading activities', () => {
                response.forEach(activity => {
                    activity.date = activity.date.split('.')[0];
                    this.activityRegistry.set(activity.id, activity);
                });
                this.loadingInitial = false;
            });             
        } catch (err) {
            runInAction('load activities error', () => this.loadingInitial = false);
            console.log(err);             
        }           
    };
    
    @action loadActivity = async (id: string) => {
        let activity = this.activityRegistry.get(id);
        if (activity) {
            this.activity = activity;
        } else {
            try {
                this.loadingInitial = true;
                activity = await agent.Activities.details(id);
                runInAction('getting activity', () => {
                    this.activity = activity;
                    this.loadingInitial = false;
                });
            } catch(err) {
                runInAction('get activity error', () => this.loadingInitial = false);
                console.log(err); 
            }
        }
    };
    
    @action clearActivity = () => {
        this.activity = null;
    };

    @action selectActivity = (id: string) => {
        this.activity = this.activityRegistry.get(id);        
    };

    @action createActivity = async (activity: IActivity) => {
        try {
            this.submitting = true;
            await agent.Activities.create(activity);
            runInAction('creating activity', () => {
                this.activityRegistry.set(activity.id, activity);                            
                this.submitting = false;
            });
        } catch (err) {
            runInAction('create activity error', () => this.submitting = false); 
            console.log(err);                       
        }
    };

    @action editActivity = async (activity: IActivity) => {
        try {
            this.submitting = true;
            await agent.Activities.update(activity);
            runInAction('editing activity', () => {
                this.activityRegistry.set(activity.id, activity);
                this.activity = activity;                       
                this.submitting = false;
            });            
        } catch (err) {
            runInAction('edit activity error', () => this.submitting = false); 
            console.log(err);            
        }
    };

    @action deleteActivity = async (id: string, target: string) => {
        try {
            this.submitting = true;
            this.target = target;
            await agent.Activities.delete(id);
            runInAction('deleting activity', () => {
                this.activityRegistry.delete(id);
                this.activity = null;                  
                this.target = '';
                this.submitting = false;
            });            
        } catch (err) {
            runInAction('delete activity error', () => {
                this.target = '';
                this.submitting = false;
            }); 
            console.log(err);                                    
        }
    };    

    @action cancelSelectedActivity = () => {
        this.activity = null;
    };
}

export default createContext(new ActivityStore());