---
title: "Busserbot"
description: "An autonomous robotic busser built for UCLA's joint ECE 183D / MAE 162D capstone: a storage unit and multi-joint robotic arm coordinated through trajectory-planning velocity control, validated across three Webots simulations."
category: "Robotics"
group: "personal"
org: "UCLA · ECE 183D / MAE 162D"
date: 2021-06-01
impact: "Built & validated"
impact_label: "storage unit and robotic arm carried from CAD and technical drawings through to 3 working Webots simulations"
tech:
  - Python
  - Webots
  - MATLAB
  - SolidWorks
repo_url: "https://github.com/hafizaj/183DB-Capstone"
---

## The brief

Automating restaurant bussing means a robot that can navigate a dining room, reach onto a table, and stack dishes into a mobile storage unit — a problem that spans mechanical design, kinematics, and systems integration, not just software. That was the brief for Team People's ECE 183D / MAE 162D capstone, a joint electrical and mechanical engineering course at UCLA run across two quarters: 183DA for the preliminary design, 183DB for critical design and build.

Seven of us worked it: four from ECE (myself, Semira Galijasevic, Shahrul Kamil, Jeffrey Yu) and three from MAE (Justin Chandra, Ricardo Martinez, Naravit Vichathorn), each covering a distinct subsystem. Mine was the robotic arm's control logic and the systems integration tying every subsystem together.

## What I built

- **Trajectory planning for the arm**, prescribing joint *velocities* rather than just target positions — forward and inverse kinematics plus cubic-polynomial motion profiles, worked out in MATLAB before being carried into the controller
- **Systems integration logic in Webots** connecting the arm controller to the storage subsystem, so pickup, transport, and stacking run as one coordinated sequence rather than three independent scripts
- **The Python control stack** the whole robot runs on, coordinating the arm, gripper, and storage cart controllers against the simulated environment

<img src="/assets/images/busserbot-full-cycle.jpg" alt="Webots simulation of Busserbot navigating a dining room of tables toward a delivery van" width="1325" height="743" loading="lazy" class="my-6 w-full rounded-xl border border-mist object-cover">

## Where it landed

The storage unit and robotic arm went from CAD and physical technical drawings through to three separate validated Webots simulations, each recorded on video: a full pickup-to-delivery cycle across a full dining room, a single stationary arm-reach test, and a storage-only run. SolidWorks motion analysis backed up the mechanical design alongside the simulation work.

It's coursework, not a shipped product — the honest version of this story is a capstone grade, not a production deployment. But the kinematics, the trajectory planning, and the systems-integration problem of getting independently-designed subsystems to actually work together as one machine are the same problems that show up in any real robotics or automation system, just without a paying customer on the other end yet.
