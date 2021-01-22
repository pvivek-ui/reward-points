import React from 'react';

interface IProps {
}

interface IState {
    rewardPoints: number,
    rewards: {month:number, points: number}[]
}

interface Transaction {
    amount: number,
    date: Date
}

const MONTHS = ["January", "February", "March", "April", "May", "June",
"July", "August", "September", "October", "November", "December" ];

const SAMPLE_TRANSACTIONS: Transaction[] = [
    {amount: 23, date: new Date("2011-10-20")},
    {amount: 50.44, date: new Date("2011-10-21")},
    {amount: 100.23, date: new Date("2011-11-20")},
    {amount: 57, date: new Date("2011-10-20")},
    {amount: 120, date: new Date("2011-11-21")},
    {amount: 50, date: new Date("2011-12-20")},
    {amount: 100, date: new Date("2011-12-21")},
    {amount: 0, date: new Date("2011-12-21")},

]

export class RootComponent extends React.Component<IProps, IState>{

    constructor(props: IProps){
        super(props);
        this.state = {
            rewardPoints: 0,
            rewards: []
        }
    }

    calculateRewards(input: Transaction[]){
        let months = [...new Set(input.map(({date}) => date.getMonth()))];
        
        let result = months.map(m => {
            let amounts = input.filter(t => t.date.getMonth() === m).map(t => t.amount);
            return {month: m, points: this.calculatePoints(amounts)}
        });

        let totalPoints: number = result.reduce((a,c) => a+c.points,0)
        this.setState({rewards: result, rewardPoints: totalPoints})
    }
    
    calculatePoints(amounts: number[]){
        let points: number = 0;
        let gte50purchases: number[] = amounts.map(p => p-50).filter(p => p>0);
        points = points + gte50purchases.reduce((a,c)=>a+c,0);
        let gte100purchases: number[] = gte50purchases.map(p => p-50).filter(p => p>0);
        points = points + gte100purchases.reduce((a,c)=>a+c,0);

        return points
    }

    render() {
        return(
            <div>
                <h1> Customer Rewards </h1>  
                <button onClick={() => this.calculateRewards(SAMPLE_TRANSACTIONS)}> start calculating </button>  
                <div>
                    {this.state.rewards.map(r => {
                        return <p key={r.month}> Points for {MONTHS[r.month]}: {r.points.toFixed(2)}</p>
                    })}
                </div>
                
                {this.state.rewardPoints>0 &&
                <p> <b>Total Reward Point: {this.state.rewardPoints.toFixed(2)}</b></p>
                }

            </div>
        )
    }
}