import React from "react";
import { storiesOf } from "@storybook/react";
import { withKnobs, select, boolean, text } from "@storybook/addon-knobs/react";
import { withA11y } from "@storybook/addon-a11y";
import { withInfo } from "@storybook/addon-info";
import { withDocs } from "../utils";

import { State, Store } from "@sambego/storybook-state";

import {
    Popover,
    PopoverHeader,
    PopoverBody,
    Button,
    UncontrolledPopover
} from "../../src";
import PopoverHoverExample from "./PopoverHoverExample";

import PopoverExample from "./PopoverExample";
import PopoverPositionExample from "./PopoverPositionExample";
import DismissiblePopover from "./DismissiblePopover.md";
import Esempi from "./Esempi.md";
import QuattroDirezioni from "./QuattroDirezioni.md";
import ElementiDisabilitati from "./ElementiDisabilitati.md";
import EsempiInterattivi from "./EsempiInterattivi.md";
import AperturaHover from "./AperturaHover.md";
const stories = storiesOf("Componenti/Popover", module);
stories.addDecorator(withA11y);

stories.add(
    "Esempi",
    withDocs(
        Esempi,
        withInfo({
            propTables: [Popover, PopoverHeader, PopoverBody],
            propTablesExclude: [PopoverExample]
        })(() => <PopoverExample />)
    )
);
stories.add(
    "AperturaHover",
    withDocs(
        AperturaHover,
        withInfo({
            propTables: [Popover, PopoverHeader, PopoverBody],
            propTablesExclude: [PopoverExample]
        })(() => <PopoverHoverExample />)
    )
);

stories.add(
    "Le quattro direzioni",
    withDocs(
        QuattroDirezioni,
        withInfo({
            propTables: [Popover, PopoverHeader, PopoverBody],
            propTablesExclude: [PopoverPositionExample]
        })(() => <PopoverPositionExample />)
    )
);

const ElementiDisabilitatiComponent = () => {
    const id = "example";
    // Avoid Jest complaints
    const target = () => document.getElementById(id);

    return (
        <div>
            <Button color="primary" id={id} disabled>
                Popover disabilitato
            </Button>
            <Popover placement="right" target={target}>
                <PopoverHeader>Titolo del popover</PopoverHeader>
                <PopoverBody>
                    Ed ecco alcuni contenuti sorprendenti. È molto coinvolgente.
                    Non trovi?
                </PopoverBody>
            </Popover>
        </div>
    );
};
stories.add(
    "Elementi disabilitati",
    withDocs(
        ElementiDisabilitati,
        withInfo({
            propTablesExclude: [Button]
        })(ElementiDisabilitatiComponent)
    )
);

const DismissiblePopoverComponent = () => {
    return (
        <div>
            <Button id="PopoverFocus" color="primary" type="button">
                Launch Popover (Focus)
            </Button>
            <UncontrolledPopover
                trigger="focus"
                placement="bottom"
                target="PopoverFocus"
            >
                <PopoverHeader>Focus Trigger</PopoverHeader>
                <PopoverBody>
                    Focusing on the trigging element makes this popover appear.
                    Blurring (clicking away) makes it disappear. You cannot
                    select this text as the popover will disappear when you try.
                </PopoverBody>
            </UncontrolledPopover>
        </div>
    );
};
stories.add(
    "Dismissible Popover",
    withDocs(
        DismissiblePopover,
        withInfo({
            propTablesExclude: [Button]
        })(DismissiblePopoverComponent)
    )
);

const store = new Store({
    isOpen: false
});

const knobsStories = storiesOf("Componenti/Popover", module);
knobsStories.addDecorator(withA11y);
knobsStories.addDecorator(withKnobs);

//Changed The Functional Component to a Class
class EsempiInterattiviComponent extends React.Component {
    constructor(props) {
        super(props);
        this.id = "example";
        // Avoid Jest complaints
        this.target = () => document.getElementById(this.id);
    }
    //All a LifeCycle Method to manage the store State when components unrender.
    componentWillUnmount() {
        store.set({ isOpen: false });
    }
    render() {
        return (
            <div style={{ padding: 250, textAlign: "center" }}>
                <Button
                    id={this.id}
                    color="primary"
                    disabled={this.props.disabled}
                    onClick={() => store.set({ isOpen: !store.get("isOpen") })}
                >
                    Popover {this.props.disabled ? "Disabilitato" : ""}
                </Button>

                <State store={store}>
                    <Popover
                        placement={this.props.placement}
                        target={this.target}
                        toggle={() =>
                            store.set({ isOpen: !store.get("isOpen") })
                        }
                        isOpen={store.get("isOpen")}
                    >
                        <PopoverHeader>{this.props.title}</PopoverHeader>
                        <PopoverBody>{this.props.body}</PopoverBody>
                    </Popover>
                </State>
            </div>
        );
    }
}
knobsStories.add(
    "Esempi interattivi",
    withDocs(
        EsempiInterattivi,
        withInfo({
            propTablesExclude: [Button, State]
        })(props => {
            //All the proerties for Addon Knobs are placed back in the function
            const disabled = boolean("Disabilitato", false);
            const placements = ["top", "bottom", "left", "right"];
            const placement = select("Posizione", placements, placements[0]);
            const title = text("Titolo", "Titolo del popover");
            const body = text(
                "Body",
                "Ed ecco alcuni contenuti sorprendenti. È molto coinvolgente. Non trovi?"
            );
            //All the knob properties are passed as props
            return (
                <EsempiInterattiviComponent
                    disabled={disabled}
                    placement={placement}
                    title={title}
                    body={body}
                    {...props}
                />
            );
        })
    )
);
