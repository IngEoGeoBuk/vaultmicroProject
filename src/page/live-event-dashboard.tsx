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

    const sampleScheduledEventCardProps: ScheduledEventCardProps[] = scheduledProducts.map((item: Product[], key: number) => ({
        event: scheduledEvent[key],
        products: item,
        onDeleteAction: (id: string) => {
            let targetKey: number = 0
            scheduledEvent.map((val: LiveEvent, key: number) => {
                if (val.id === id) {
                    targetKey = key
                } 
            })
            Axios.delete(`${baseUrl}/live-event/${id}`)
            .then(() => {
                setScheduledProducts(scheduledProducts.filter((val: Product[], key: number) => {
                    return key !== targetKey;
                }))
                setScheduledEvent(scheduledEvent.filter((val: LiveEvent, key: number) => {
                    return key !== targetKey;
                }))
            }).catch((err) => {
                console.log(err)
            })
        },
        onLiveEventAction: (id: string) => {
            let targetKey: number = 0
            scheduledEvent.map((val: LiveEvent, key: number) => {
                if (val.id === id) {
                    targetKey = key
                } 
            })
            Axios.patch(`${baseUrl}/live-event/${id}`, {
                status: LiveStatus.LIVE 
            })
            .then(() => {
                setLiveEvent(liveEvent => [...liveEvent, scheduledEvent[targetKey]])
                setLiveProducts(liveProducts => [...liveProducts, scheduledProducts[targetKey]])
                setScheduledProducts(scheduledProducts.filter((val: Product[], key: number) => {
                    return key !== targetKey;
                }))
                setScheduledEvent(scheduledEvent.filter((val: LiveEvent, key: number) => {
                    return key !== targetKey;
                }))
            }).catch((err) => {
                console.log(err)
            })
        },
    }))

    const sampleLiveEventCardProps: LiveEventCardProps[] = liveProducts.map((item: Product[], key: number) => ({
        event: liveEvent[key],
        products: item,
        onDeleteAction: (id: string) => {
            let targetKey: number = 0
            liveEvent.map((val: LiveEvent, key: number) => {
                if (val.id === id) {
                    targetKey = key
                } 
            })
            Axios.delete(`${baseUrl}/live-event/${id}`)
            .then(() => {
                setLiveProducts(liveProducts.filter((val: Product[], key: number) => {
                    return key !== targetKey;
                }))
                setLiveEvent(liveEvent.filter((val: LiveEvent, key: number) => {
                    return key !== targetKey;
                }))
            }).catch((err) => {
                console.log(err)
            })
        },
        onFinishedEventAction: (id: string) => {
            let targetKey: number = 0
            liveEvent.map((val: LiveEvent, key: number) => {
                if (val.id === id) {
                    targetKey = key
                } 
            })
            Axios.patch(`${baseUrl}/live-event/${id}`, {
                status: LiveStatus.FINISHED 
            })
            .then(() => {
                setFinishedEvent(finishedEvent => [...finishedEvent, liveEvent[targetKey]])
                setFinishedProducts(finishedProducts => [...finishedProducts, liveProducts[targetKey]])
                setLiveProducts(liveProducts.filter((val: Product[], key: number) => {
                    return key !== targetKey;
                }))
                setLiveEvent(liveEvent.filter((val: LiveEvent, key: number) => {
                    return key !== targetKey;
                }))
            }).catch((err) => {
                console.log(err)
            })
        },
    }))

    const sampleFinishedEventCardProps: FinishedEventCardProps[] = finishedProducts.map((item: Product[], key: number) => ({
        event: finishedEvent[key],
        products: item,
        onDeleteAction: (id: string) => {
            let targetKey: number = 0
            finishedEvent.map((val: LiveEvent, key: number) => {
                if (val.id === id) {
                    targetKey = key
                } 
            })
            Axios.delete(`${baseUrl}/live-event/${id}`)
            .then(() => {
                setFinishedProducts(finishedProducts.filter((val: Product[], key: number) => {
                    return key !== targetKey;
                }))
                setFinishedEvent(finishedEvent.filter((val: LiveEvent, key: number) => {
                    return key !== targetKey;
                }))
            }).catch((err) => {
                console.log(err)
            })
        },
    }))

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
                    {sampleScheduledEventCardProps.map((val: ScheduledEventCardProps, key: number) => {
                        return (
                            <ScheduledEventCard 
                                event={val.event}
                                products={val.products}
                                onDeleteAction={val.onDeleteAction}
                                onLiveEventAction={val.onLiveEventAction}
                            />
                        )
                    })}
                </Layout.Section>
                <Layout.Section oneThird>
                    <Heading>방송 중인 이벤트</Heading>
                    {sampleLiveEventCardProps.map((val: LiveEventCardProps, key: number) => {
                        return (
                            <LiveEventCard 
                                event={val.event}
                                products={val.products}
                                onDeleteAction={val.onDeleteAction}
                                onFinishedEventAction={val.onFinishedEventAction}
                            />
                        )
                    })}
                </Layout.Section>
                <Layout.Section oneThird>
                    <Heading>방송 종료된 이벤트</Heading>
                    {sampleFinishedEventCardProps.map((val: FinishedEventCardProps, key: number) => {
                        return (
                            <FinishedEventCard 
                                event={val.event}
                                products={val.products}
                                onDeleteAction={val.onDeleteAction}
                            />
                        )
                    })}
                </Layout.Section>
            </Layout>
        </Page>
    )
}
