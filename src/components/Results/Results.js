import React from "react";
import styles from './Results.module.css';

const Results = (props) => {
    const renderedElement = props.result.url ? (
        <div className={styles.result} role="result">
            <img className={styles.result__img} src={props.result.image} alt={props.result.name} />
            <a target="_blank" title={`Click for more details on ${props.result.name}`} className={styles.result__link} href={props.result.url}>{props.result.name}</a>
        </div>
    ) : <p aria-label="alert" className={styles.pokemon__nfound}>We didn't find {props.result.name}. It could simply be an error in the network or maybe someday if we explore more, we'd find it actually exists. 😆</p>
    return renderedElement;
}

export default Results;