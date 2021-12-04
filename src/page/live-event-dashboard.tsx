import {AppProvider, Heading, Layout, Page, ResourceList, TextStyle, Thumbnail, Button} from "@shopify/polaris";
import {useEffect, useState} from "react";
import {ScheduledEventCard} from "../component/scheduled-event-card";
import {FinishedEventCardProps, LiveEventCardProps, ScheduledEventCardProps} from "../interface/event-card.props";
import {LiveStatus} from "../entities/live-event.entity";
import {LiveEventCard} from "../component/live-event-card";
import {FinishedEventCard} from "../component/finished-event-card";
import {useHistory} from "react-router-dom";
import {Product} from "../entities/product.entity";
import {LiveEvent} from "../entities/live-event.entity";
import Axios from 'axios';
import {baseUrl} from '../component/baseUrl'

export function LiveEventDashboard() {
    
    const [scheduledEvent, setScheduledEvent] = useState<LiveEvent[]>([]);
    const [scheduledProducts, setScheduledProducts] = useState<Product[][]>([]);

    const [liveEvent, setLiveEvent] = useState<LiveEvent[]>([]);
    const [liveProducts, setLiveProducts] = useState<Product[][]>([]);

    const [finishedEvent, setFinishedEvent] = useState<LiveEvent[]>([]);
    const [finishedProducts, setFinishedProducts] = useState<Product[][]>([]);
    const history = useHistory();

    const onDeleteAction = (id: string) => {
        Axios.delete(`${baseUrl}/live-event/${id}`)
        .then(() => {
            setScheduledEvent(scheduledEvent.filter((val: LiveEvent) => {
                return val.id !== id;
            }))
            setLiveEvent(liveEvent.filter((val: LiveEvent) => {
                return val.id !== id;
            }))
            setFinishedEvent(finishedEvent.filter((val: LiveEvent) => {
                return val.id !== id;
            }))
        }).catch((err) => {
            console.log(err)
        })
    }

    const onLiveEventAction = (id: string) => {
        Axios.patch(`${baseUrl}/live-event/${id}`, {
            status: LiveStatus.LIVE 
        })
    }

    const onFinishedEventAction = (id: string) => {
        Axios.patch(`${baseUrl}/live-event/${id}`, {
            status: LiveStatus.FINISHED 
        })
    }  


    useEffect(() => {
        Axios.get(`${baseUrl}/live-event`)
        .then((res) => {
            res.data.liveEvents.map((val: LiveEvent) => {
                if(val.status === LiveStatus.SCHEDULED) {
                    setScheduledEvent(scheduledEvent => [...scheduledEvent, val])
                    Axios.get(`${baseUrl}/live-event/${val.id}/products`)
                    .then((res2) => {
                        setScheduledProducts(scheduledProducts => [...scheduledProducts, res2.data.products]) 
                    }).catch((err) => {
                        console.log(err)
                    })
                } else if (val.status === LiveStatus.LIVE) {
                    setLiveEvent(liveEvent => [...liveEvent, val])
                    Axios.get(`${baseUrl}/live-event/${val.id}/products`)
                    .then((res2) => { 
                        setLiveProducts(liveProducts => [...liveProducts, res2.data.products]) 
                    }).catch((err) => {
                        console.log(err)
                    })
                } else {
                    setFinishedEvent(finishedEvent => [...finishedEvent, val])
                    Axios.get(`${baseUrl}/live-event/${val.id}/products`)
                    .then((res2) => {
                        setFinishedProducts(finishedProducts => [...finishedProducts, res2.data.products]) 
                    }).catch((err) => {
                        console.log(err)
                    })                    
                }
            })
        }).catch((err) => {
            console.log(err)
        })
    }, [])

    return (
        <Page title={'이벤트 대시보드'} fullWidth secondaryActions={[{
            content: '라이브 쇼핑 페이지로 이동', onAction: () => {
                window.location.href = '/live-shopping-page'
            }
        }]} primaryAction={{
            content: '새 이벤트 생성하기', onAction: () => {
                history.push('create-live-event')
            }
        }}>
            <Layout>
                <Layout.Section oneThird>
                    <Heading>방송 대기중인 이벤트</Heading>
                    {scheduledEvent != null && 
                    scheduledProducts != null && 
                    scheduledProducts.length != 0 && 
                    scheduledProducts.map((val: Product[], key: number) => {
                        return (
                            <ScheduledEventCard 
                                event={scheduledEvent[key]}
                                products={val}
                                onDeleteAction={onDeleteAction}
                                onLiveEventAction={onLiveEventAction}
                            />
                        )
                    })}
                </Layout.Section>
                <Layout.Section oneThird>
                    <Heading>방송 중인 이벤트</Heading>
                    {liveEvent != null && 
                    liveProducts != null && 
                    liveProducts.length != 0 && 
                    liveProducts.map((val: Product[], key: number) => {
                        return (
                            <LiveEventCard 
                                event={liveEvent[key]}
                                products={val}
                                onDeleteAction={onDeleteAction}
                                onFinishedEventAction={onFinishedEventAction}
                            />
                        )
                    })}
                </Layout.Section>
                <Layout.Section oneThird>
                    <Heading>방송 종료된 이벤트</Heading>
                    {finishedEvent != null && 
                    finishedProducts != null && 
                    finishedProducts.length != 0 && 
                    finishedProducts.map((val: Product[], key: number) => {
                        return (
                            <FinishedEventCard 
                                event={finishedEvent[key]}
                                products={val}
                                onDeleteAction={onDeleteAction}
                            />
                        )
                    })}
                </Layout.Section>
            </Layout>
        </Page>
    )
}
