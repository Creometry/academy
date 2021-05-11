import React from 'react';
import { withStyles} from '@material-ui/core/styles';
import {useState, useEffect} from 'react';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import { WithContext as ReactTags } from 'react-tag-input';
import Section from './Section';
import axios from 'axios';
import Markdown from 'markdown-to-jsx';

const KeyCodes = {
	comma: 188,
	enter: 13,
};
const delimiters = [KeyCodes.comma, KeyCodes.enter];


function EditCourse(props) {
    const BlueRadio = withStyles({
        root: {
          color: "#1692bf",
          '&$checked': {
            color: "#1692bf",
          },
        },
        checked: {},
    })((props) => <Radio color="default" {...props} />);
    
    const [id, setID] = useState("")
    const [Title, setTitle] = useState("")
    const [Teacher, setTeacher] = useState("")
    const [Category, setCategory] = useState("")
    const [Language, setLanguage] = useState("")
    const [Description, setDescription] = useState("")
	const [LevelValue, setLevelValue] = useState('Beginner');
    const [Price, setPrice] = useState();
    const [Image, setImage] = useState();
    const [tags , setTags] = useState([])
    const [sectionTitle, setSectionTitle] = useState([])
	const [sections, setSections ] = useState([{title:"",content:""}])
    const [course, setCourse] = useState({sections:[]})

    const getDetails= () => {
       console.log(props)
        axios.get("http://localhost:5000/course/CourseDetail?id="+props.match.params.idCourse ).then(
        res => {
                  
          setID(props.match.params.idCourse)
          setTitle(res.data.course.title)
          setTeacher(res.data.course.teacher)
          setCategory(res.data.course.category) 
          setLanguage(res.data.course.language)
          setLevelValue(res.data.course.level)
          setDescription(res.data.course.description)
          setTags(res.data.course.tags)
          setPrice(res.data.course.price)
          setImage(res.data.course.image)
          setLevelValue(res.data.course.level)
          setSectionTitle(res.data.sections)
        
        })
        axios.get("http://localhost:5000/course/SectionDetails?id="+props.match.params.idCourse ).then(
            res => {
                setSections(res.data.sections)
            }
        )
    };
    

    const handleDelete=(i)=> {
       const newTags = tags.filter((tag, index) => index !== i) ;
        setTags(newTags);
    }

    const handleAddition=(tag)=> {
        setTags( [...tags, tag] );
		
    }
    const handleDrag =(tag, currPos, newPos) =>{
        
        const newTags = tags.slice();

        newTags.splice(currPos, 1);
        newTags.splice(newPos, 0, tag);

        // re-render
        setTags( newTags );
    }
        
        const handleChangeLevel = (event) => {
            setLevelValue(event.target.value);
            console.log(LevelValue)
        };
        
        
        
        const addNewSection =()=>{
            setSections(
                [...sections, {title: "", 
                content:`<h1> This is a new section </h1>
                <p> Add the content ... </p>` }]
            )
        }
        const ChangeTitle =(valeur, index )=>{
            let variable = sections;
            
            variable[index].title = valeur ;
            
            this.setSections( variable)
            
        }
        const ChangeContent =(valeur, index)=>{
            
            let variable = sections;
            variable[index].content = valeur ;
            
            setSections(variable);
            console.log(sections);
    
        }
        const SaveText=()=>{
            
            var showdown  = require('showdown'),
                converter = new showdown.Converter();
    
                sections.map((e, index)=> {
                    
                    e.content = converter.makeMarkdown(e.content)
                })
                console.log(sections)
                
                /*
                axios.post("http://localhost:5000/course/addSections", {
                    sections: this.state.sections ,
                    title : this.state.title,
                    teacher : this.state.teacher
                }).then(res=>{
                    console.log("Course content well added !! !")
                })
                */
        }
        const SaveEdits=()=>{
            const CourseModified = {
                _id : id,
                title : Title ,
                teacher: Teacher ,
                category: Category ,
                language : Language ,
                level : LevelValue,
                description : Description ,
                tags : tags,
                image : Image,
                price : Price,
                sections : sectionTitle
            }
              
            axios.post("http://localhost:5000/course/modifyContent" ,{
                course : CourseModified,
                id : id,
                }).then(
                res=> console.log("course very well modified !!! ")
            )
        }
        return ( 
            <div>
                <div className="breadcrumbs" data-aos="fade-in">
                    <div className="container">
                        <h2>Edit your course</h2>
                    </div>
                </div>
                <button className="PrimaryButton" onClick={getDetails} >Refresh</button>
                <form className="form-style container-md mb- mt-5">
                    <input type="text"  placeholder="Course Title" required="false" value={Title} />
                    <textarea placeholder="Course Description"value={Description}></textarea>
                    <h6>Course Level</h6>
                    <FormControl component="fieldset" className="mb-4">
                        <RadioGroup row aria-label="gender"  value={LevelValue} onChange={handleChangeLevel}>
                            <FormControlLabel value="Beginner" control={<BlueRadio />} label="Beginner" />
                            <FormControlLabel value="Intermediate" control={<BlueRadio />} label="Intermediate" />
                            <FormControlLabel value="Advanced" control={<BlueRadio />} label="Advanced" />
                        </RadioGroup>
                    </FormControl>

                    <input type="text"  placeholder="Course Language" value={Language} required ="false"/>
                    <input type="text"  placeholder="Course Category" value={Category} onChange={e => setCategory(e.target.value)} required={false}/>
                    <input type="text"  placeholder="Course Teacher" value={Teacher} onChange={e => setTeacher(e.target.value)} required={false}/>

                    <ReactTags tags={tags}
									//suggestions={suggestions}
									handleDelete={handleDelete}
									handleAddition={handleAddition}
                                    handleDrag={handleDrag}
									placeholder="Course key words ..."
                                    autofocus={false}
							delimiters={delimiters} />                    
                    <input type="number"  placeholder="Course Price in TND" value={Price} required ="false"/>
                    <input type="text"  placeholder="Image banner Link" value={Image} required ="false"/>        
                </form>

            <div className="container-sm top-space mb-4">
                <button className="btn-outlined-sm mb-4" onClick={addNewSection} >Add a section </button>
                <br/>
                {sections.map((c, index)=>
                    <div className="mb-5">
                        <h5>Section {index+1} </h5>
                        <Section 
                            key={index} 
                            ChangeTitle={ChangeTitle} 
                            ChangeContent={ChangeContent} 
                            Contenu={c.content}
                            Title={c.title} 
                            index={index} 
                        /> 
                        <i className="far fa-trash-alt red-icon"/>
                        
                    </div>
                )} 
                 
                <button className="PrimaryButton mt-3 mb-4" onClick={SaveEdits} >Submit</button>
                <br/>
            </div>

            </div>
        );
    
}
 
export default EditCourse;