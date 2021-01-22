import React, { Component } from "react";

const DoH = require('doh-js-client').DoH
const publicIp = require('public-ip');

class Status extends Component {
    constructor() {
        super();
        this.state = { data: [], ip: "0.0.0.0", latency: "" };
    }

    fetchIp() {
        // getting ip address then changnig state
        publicIp.v4().then(res => this.setState({ ip: res }));
    }

    async calculateLatency() {
        this.useGoogleApiForLatency();
    }

    useDoHForLatency(){
        let start = performance.now();
        let dns = new DoH('google')
        dns.resolve('google.ca', 'A')
            .then(function (record) {
                // console.log(record);
                this.setState({
                    latency: Math.floor(performance.now()-start)
                });
            })
            .catch(function (err) {
                console.error(err)
            })
    }

    useGoogleApiForLatency(){
        //saving request start time
        let start = performance.now();
        //fetching from google dns api
        fetch('https://dns.google/resolve?name=google.ca').then((res) => {
            // console.log(res);
            this.setState({
                latency: Math.floor(performance.now()-start)
            });
        });
    }

    componentDidMount() {
        this.fetchIp();
        setInterval(()=>{this.calculateLatency()},500);
    }

    render() {
        return <div>
            <p> You have an internet with {navigator.connection.effectiveType} like speed </p>
            <p> Your IP address is {this.state.ip} </p>
            <p> Your latency is {this.state.latency} </p>
        </div>;
    }

};


export default Status;