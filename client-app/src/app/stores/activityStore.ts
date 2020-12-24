import { observable, action, computed, configure, runInAction } from 'mobx';
import { createContext } from 'react';
import agent from '../api/agent';
import { IActivity } from '../models/activity';

configure({enforceActions: 'always'});

class ActivityStore {
    @observable activityRegistry = new Map();    
    @observable loadingInitial = false;
    @observable selectedActivity: IActivity | undefined;
    @observable editMode = false;
    @observable submitting = false;
    @observable target = '';

    @computed get activitiesByDate() {
        return Array.from(this.activityRegistry.values())
            .sort((a, b) => Date.parse(a.date) - Date.parse(b.date));
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

    @action selectActivity = (id: string) => {
        this.selectedActivity = this.activityRegistry.get(id);
        this.editMode = false;
    };

    @action createActivity = async (activity: IActivity) => {
        try {
            this.submitting = true;
            await agent.Activities.create(activity);
            runInAction('creating activity', () => {
                this.activityRegistry.set(activity.id, activity);            
                this.editMode = false;
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
                this.selectedActivity = activity;       
                this.editMode = false;
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
                this.selectedActivity = undefined;                  
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

    @action openCreateForm = () => {
        this.editMode = true;
        this.selectedActivity = undefined;        
    };

    @action openEditForm = () => {
        this.editMode = true;             
    };

    @action closeEditForm = () => {
        this.editMode = false;             
    };

    @action cancelSelectedActivity = () => {
        this.selectedActivity = undefined;
    };
}

export default createContext(new ActivityStore());