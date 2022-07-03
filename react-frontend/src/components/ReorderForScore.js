import React from "react";
import DesignationList from "./ReorderData";
import CollegeList from "./ReorderCollegeData";
import { ListContainer, ListItem } from "./ReorderStyle";
import { DragHandle } from "./partials/DragHandle";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const ReorderForScore = () => {
  const designationList = DesignationList.getList();
  const collegeList = CollegeList.getCollegeList();

  return (
    <div style={{ display: "flex", margin: 20, justifyContent: "center" }}>
        <div className="App" style={{ paddingRight: 20}}>
        <DragDropContext
            onDragEnd={(param) => {
            const srcI = param.source.index;
            const desI = param.destination?.index;
            if (desI) {
                designationList.splice(desI, 0, designationList.splice(srcI, 1)[0]);
                DesignationList.saveList(designationList);
            }
            }}
        >
            <ListContainer>
            <h1>Designation</h1>
            <Droppable droppableId="droppable-1">
                {(provided, _) => (
                <div ref={provided.innerRef} {...provided.droppableProps}>
                    {designationList.map((item, i) => (
                    <Draggable
                        key={item.id}
                        draggableId={"draggable-" + item.id}
                        index={i}
                    >
                        {(provided, snapshot) => (
                        <ListItem
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            style={{
                            ...provided.draggableProps.style,
                            boxShadow: snapshot.isDragging
                                ? "0 0 .4rem #666"
                                : "none",
                            }}
                        >
                            <DragHandle {...provided.dragHandleProps} />
                            <span>{item.title}</span>
                        </ListItem>
                        )}
                    </Draggable>
                    ))}
                    {provided.placeholder}
                </div>
                )}
            </Droppable>
            </ListContainer>
        </DragDropContext>
        </div>
        <div className="App" style={{ paddingLeft: 20}}>
        <DragDropContext
        onDragEnd={(param) => {
            const srcI = param.source.index;
            const desI = param.destination?.index;
            if (desI) {
            collegeList.splice(desI, 0, collegeList.splice(srcI, 1)[0]);
            CollegeList.saveCollegeList(collegeList);
            }
        }}
        >
        <ListContainer>
            <h1>College Ranking</h1>
            <Droppable droppableId="droppable-1">
            {(provided, _) => (
                <div ref={provided.innerRef} {...provided.droppableProps}>
                {collegeList.map((item, i) => (
                    <Draggable
                    key={item.id}
                    draggableId={"draggable-" + item.id}
                    index={i}
                    >
                    {(provided, snapshot) => (
                        <ListItem
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        style={{
                            ...provided.draggableProps.style,
                            boxShadow: snapshot.isDragging
                            ? "0 0 .4rem #666"
                            : "none",
                        }}
                        >
                        <DragHandle {...provided.dragHandleProps} />
                        <span>{item.title}</span>
                        </ListItem>
                    )}
                    </Draggable>
                ))}
                {provided.placeholder}
                </div>
            )}
            </Droppable>
        </ListContainer>
        </DragDropContext>
        </div>
  </div>
  );
};

export default ReorderForScore;
