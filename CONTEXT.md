# CI/CD Demo

This context names the tiny demonstration project used to explain an integration and delivery pipeline in an oral evaluation.

## Language

**Demo App**:
A deliberately trivial frontend whose purpose is to exercise the delivery pipeline, not to provide product functionality.
_Avoid_: product app, final system

**Green Change**:
A change expected to pass the pipeline and be eligible for delivery.
_Avoid_: successful deploy, good code

**Broken Change**:
A change intentionally made to fail the pipeline before delivery.
_Avoid_: bad deploy, production bug

**Pipeline**:
The automated path from a committed change to a verified build that can be delivered.
_Avoid_: app flow, release script

**Pipeline Gate**:
A required automated check that a Green Change must pass and a Broken Change should fail before delivery.
_Avoid_: manual review, optional check

**Type Gate**:
A Pipeline Gate that rejects changes with TypeScript errors before delivery.
_Avoid_: editor warning, manual type review

**Test Gate**:
A Pipeline Gate that rejects changes when the automated test no longer matches the expected Demo App behavior.
_Avoid_: visual check, manual QA

**Build Gate**:
A Pipeline Gate that rejects changes when the Demo App cannot be compiled into deliverable static assets.
_Avoid_: local preview, deploy check

**Delivery Target**:
The environment where a verified Demo App is published for the evaluator to open.
_Avoid_: server, production app

**Fallback Delivery Target**:
An alternate Delivery Target kept available only if the preferred target cannot be used.
_Avoid_: second production, duplicate deploy

**Delivery Branch**:
The branch whose Green Changes are allowed to reach the Delivery Target.
_Avoid_: default branch, production branch

**Package Manager**:
The tool used consistently by developers and the Pipeline to install dependencies and run scripts.
_Avoid_: npm, mixed package tools

**Demo Guide**:
The README section that explains how to run, break, and defend the Pipeline during the evaluation.
_Avoid_: user manual, product documentation

**Feedback Mechanism**:
The channel where the delivery result is recorded after the Pipeline finishes, whether the result is successful or failed.
_Avoid_: chat note, informal request

**Feedback Item**:
A single delivery result recorded in the Feedback Mechanism after a Pipeline run.
_Avoid_: comment, idea, loose task

**Automated Feedback Update**:
A Pipeline step that records the final delivery result in Linear without manual intervention.
_Avoid_: manual status note, after-demo edit

## Example Dialogue

Developer: "I will make a Green Change to the Demo App so the Pipeline passes."

Evaluator: "How do you show a failure?"

Developer: "I make a Broken Change in the Demo App and show that the Pipeline Gate blocks delivery."

Developer: "The preferred Delivery Target is Vercel, and the Fallback Delivery Target is my VPS."

Developer: "Only Green Changes merged into the Delivery Branch are delivered."

Developer: "The Package Manager is pnpm, both locally and in the Pipeline."

Developer: "A Broken Change can fail at the Type Gate, Test Gate, or Build Gate."

Developer: "The Demo Guide lists the commands and the oral walkthrough."

Developer: "After the Pipeline finishes, Linear records the Feedback Item as success or error."

Developer: "The Automated Feedback Update posts the Pipeline result back to Linear."
