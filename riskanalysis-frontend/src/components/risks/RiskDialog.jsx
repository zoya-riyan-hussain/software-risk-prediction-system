import { useState, useEffect } from "react";
import {
Dialog,
DialogTitle,
DialogContent,
DialogActions,
Button,
TextField,
MenuItem,
Stack
} from "@mui/material";
import API from "../../services/api";

const initialRisk={
title:"",
description:"",
category:"SCHEDULE",
probability:1,
impact:1,
status:"OPEN",
mitigationPlan:"",
identifiedDate:"",
dueDate:"",
projectId:2,
ownerId:1
};

function RiskDialog({open,handleClose,refreshRisks,risk}){

const[riskData,setRiskData]=useState(initialRisk);

useEffect(()=>{
if(risk){
setRiskData({
id:risk.id,
title:risk.title,
description:risk.description,
category:risk.category,
probability:risk.probability,
impact:risk.impact,
status:risk.status,
mitigationPlan:risk.mitigationPlan,
identifiedDate:risk.identifiedDate,
dueDate:risk.dueDate,
projectId:risk.project?.id||2,
ownerId:risk.owner?.id||1
});
}else{
setRiskData(initialRisk);
}
},[risk,open]);

const handleChange=(e)=>{
setRiskData({
...riskData,
[e.target.name]:e.target.value
});
};

const handleSave=async()=>{

const payload={
title:riskData.title,
description:riskData.description,
category:riskData.category,
probability:Number(riskData.probability),
impact:Number(riskData.impact),
status:riskData.status,
mitigationPlan:riskData.mitigationPlan,
identifiedDate:riskData.identifiedDate,
dueDate:riskData.dueDate,
projectId:Number(riskData.projectId),
ownerId:Number(riskData.ownerId)
};

try{

if(riskData.id){
await API.put(`/risks/${riskData.id}`,payload);
}else{
await API.post("/risks",payload);
}

refreshRisks();
handleClose();
setRiskData(initialRisk);

}catch(err){
console.log(err.response);
alert("Unable to save risk.");
}

};

return(
<Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">

<DialogTitle>
{riskData.id?"Edit Risk":"Create Risk"}
</DialogTitle>

<DialogContent>

<Stack spacing={3} mt={1}>

<TextField
label="Risk Title"
name="title"
value={riskData.title}
onChange={handleChange}
/>

<TextField
label="Description"
name="description"
multiline
rows={3}
value={riskData.description}
onChange={handleChange}
/>

<TextField
select
label="Category"
name="category"
value={riskData.category}
onChange={handleChange}
>
<MenuItem value="SCHEDULE">Schedule</MenuItem>
<MenuItem value="COST">Cost</MenuItem>
<MenuItem value="TECHNICAL">Technical</MenuItem>
<MenuItem value="RESOURCE">Resource</MenuItem>
<MenuItem value="SECURITY">Security</MenuItem>
</TextField>

<TextField
label="Probability (1-5)"
type="number"
name="probability"
value={riskData.probability}
onChange={handleChange}
/>

<TextField
label="Impact (1-5)"
type="number"
name="impact"
value={riskData.impact}
onChange={handleChange}
/>

<TextField
select
label="Status"
name="status"
value={riskData.status}
onChange={handleChange}
>
<MenuItem value="OPEN">OPEN</MenuItem>
<MenuItem value="IN_PROGRESS">IN_PROGRESS</MenuItem>
<MenuItem value="RESOLVED">RESOLVED</MenuItem>
</TextField>

<TextField
label="Mitigation Plan"
name="mitigationPlan"
multiline
rows={3}
value={riskData.mitigationPlan}
onChange={handleChange}
/>

<TextField
type="date"
label="Identified Date"
name="identifiedDate"
InputLabelProps={{shrink:true}}
value={riskData.identifiedDate}
onChange={handleChange}
/>

<TextField
type="date"
label="Due Date"
name="dueDate"
InputLabelProps={{shrink:true}}
value={riskData.dueDate}
onChange={handleChange}
/>

</Stack>

</DialogContent>

<DialogActions>

<Button onClick={handleClose}>
Cancel
</Button>

<Button
variant="contained"
onClick={handleSave}
>
{riskData.id?"Update":"Save"}
</Button>

</DialogActions>

</Dialog>
);

}

export default RiskDialog;