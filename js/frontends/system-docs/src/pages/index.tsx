import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';

// @ts-ignore
import MessengerScreensUrl from '@site/static/screens/messenger_new_chat.png';
import styles from './index.module.css';

export default function Home(): JSX.Element {
    const {siteConfig} = useDocusaurusContext();
    return (
        <Layout
            title={`ESME docs`}
            description="Engineering thesis by Wojciech Fabjańczuk">
            <HomepageHeader/>
            <main>
                <HomepageIntroduction/>
            </main>
        </Layout>
    );
}

function HomepageHeader() {
    const {siteConfig} = useDocusaurusContext();
    return (
        <header className={clsx('hero hero--primary', styles.heroBanner)}>
            <div className="container">
                <h1 className="hero__title">{siteConfig.title}</h1>
                <p className="hero__subtitle">{siteConfig.tagline}</p>
                <div className={styles.buttons}>
                    <Link
                        className="button button--secondary button--lg"
                        to="/docs/analysis/functional-requirements">
                        See documentation
                    </Link>
                </div>
            </div>
        </header>
    );
}

function HomepageIntroduction(): JSX.Element {
    return (
        <div className={styles.content}>
            <section className={styles.section}>
                <div className="container">
                    <h2>Description</h2>
                    <div className={styles.paragraph}>
                        Engineering thesis by <Author/> under the supervision of mgr Piotr Gago. Defended
                        in July 2023 at the <University/>.
                    </div>
                    <div className={styles.paragraph}>
                        Implemented emergency service allows the participants to request help on mass events and to
                        start chats with the organizers. Requests for help are put in the queue first so the organizers
                        talk only to the number of participants they can handle in case of heavy application workload.
                        Being informed about the dangers, the organizers may send help or stop the event if necessary.
                        Organizers can create issues for monitoring the incidents and review history of all
                        conversations.
                    </div>
                    <div className={styles.paragraph}>
                        This project is a <span className={styles.disclaimer}>proof of concept</span> and a <span
                        className={styles.disclaimer}>learning experience</span>. It is not ready to use on a real
                        mass event.
                    </div>
                </div>
            </section>
            <section className={styles.section}>
                <div className="container">
                    <h2>Background</h2>
                    <div className={styles.paragraph}>
                        The tragic event that directly inspired this work is the crowd surge which happened on the
                        5th November 2021 at the <AstroworldFestival/> in Houston, Texas, where several people died
                        and many others became injured.
                        There were an estimated 50,000 fans at the concert when Travis Scott, the main star of the
                        show, entered the stage resulting in people rushing to the front stage and squeezing so
                        tightly, that some struggled to breathe.
                        Despite this mass casualty incident, the show continued for 40 minutes <References/>.
                    </div>
                    <div className={styles.paragraph}>
                        Supposedly, if the participants had an easy way to notify the organizers about dangerous
                        situations, they could have sped up sending the help and prevent many injuries or even
                        deaths. Having the information provided by the participants in the crowd, the organizers
                        could have stopped the show earlier and might have reacted more appropriately without
                        inducing too much panic.
                    </div>
                </div>
            </section>
            <section className={styles.section}>
                <div className="container">
                    <h2>Goal</h2>
                    <div className={styles.paragraph}>
                        The goal of the thesis is to support the security of mass events like concerts, parades and
                        gatherings no matter the kind or the political affiliation. Extreme conditions of such events,
                        i.e. enormous crowds and loud noise or music can make it impossible to contact the organizers in
                        person or via a phone call.
                    </div>
                    <div className={styles.paragraph}>
                        The solution has to allow the participants to request help on mass events and communicate with
                        the organizers. Being informed about the dangers, the organizers will be able to send help or
                        stop the event if necessary.
                    </div>
                    <div className={styles.paragraph}>
                        Secondary goal of the thesis is to popularize the topic of public safety software and hopefully
                        to inspire future work in that area.
                    </div>
                </div>
            </section>
            <section className={styles.section}>
                <div className="container">
                    <img src={MessengerScreensUrl} alt="chat"/>
                </div>
            </section>
        </div>
    );
}

function Author(): JSX.Element {
    return <a href="https://www.linkedin.com/in/wfabjanczuk/">Wojciech Fabjańczuk</a>
}

function University(): JSX.Element {
    return <a href="https://pja.edu.pl/en/">Polish-Japanese Academy of Information Technology</a>
}

function AstroworldFestival(): JSX.Element {
    return <a href="https://en.wikipedia.org/wiki/Astroworld_Festival_crowd_crush">Astroworld Festival</a>
}

function References(): JSX.Element {
    const links = [
        "https://www.washingtonpost.com/nation/2021/11/06/astroworld-travis-scott-deaths-houston",
        "https://www.washingtonpost.com/nation/2021/11/11/ninth-death-astroworld-concert",
        "https://www.nytimes.com/2021/11/06/us/travis-scott-crowd-surge.html",
    ]

    const formatIndex = (idx: number): string => {
        const n = idx + 1;
        return (n == links.length)
            ? n.toString()
            : `${n}, `
    }

    return (
        <span>
        [{links.map((l, i) =>
            <a key={`reference_${i}`} href={l}>{formatIndex(i)}</a>)
        }]
        </span>
    )
}