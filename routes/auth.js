const express = require("express")
const router = express.Router()
const Role = require("../Schema/Role")
const signUp = require("../Schema/Signup")
const Course = require("../Schema/Course")
const Teacher = require("../Schema/Teacher")
const School = require("../Schema/School")
const bcrypt = require("bcrypt")
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const uploadDirectory = path.join(__dirname, "uploads");

// Create the uploads directory if it doesn't exist
if (!fs.existsSync(uploadDirectory)) {
    fs.mkdirSync(uploadDirectory, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDirectory);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + "-" + uniqueSuffix + "." + file.mimetype.split("/")[1]);
    }
});

const upload = multer({ storage: storage });

// Api for creating Role
router.post("/addRole", async (req, res) => {
    try {
        const { role } = req.body
        const newRole = await Role.create({
            role
        })
        res.json(newRole)
    } catch (error) {
        console.log(error)
        res.status(500).send("internal server error occured")
    }
})

// Api for adding user
router.post("/adduser", async (req, res) => {
    try {
        const { email, password, role, confirmPassword, name } = req.body

        const checkUserr = await signUp.findOne({ email })
        if (checkUserr) {
            return res.status(400).json({ message: "user with this email already exists" })
        }
        // confirm password
        if (password !== confirmPassword) {
            return res.status(400).json({ message: "Password does not match" })
        }

        const hashPassword = await bcrypt.hash(password, 10)

        const newUserr = await signUp.create({
            name,
            email,
            password: hashPassword,
            role
        })

        res.json(newUserr)

    } catch (error) {
        console.log(error)
        res.status(500).send("internal server error occured")
    }
})

// Api for signup
router.post("/signup", async (req, res) => {
    try {
        const { email, password, confirmPassword, name } = req.body;
        // check email
        const checkEmail = await signUp.findOne({ email })
        if (checkEmail) {
            return res.status(400).json({ message: "user with this email already exists" })
        }
        // confirm password
        if (password !== confirmPassword) {
            return res.status(400).json({ message: "Password does not match" })
        }
        // hash password
        const hashPasword = await bcrypt.hash(password, 10)
        // create new user
        const newSignUser = await signUp.create({
            name,
            email,
            password: hashPasword,
            role: "customer"
        })


        res.status(200).json(newSignUser);
    } catch (error) {
        console.log(error)
        res.status(500).send("internal server error occred")
    }

})

// create default user
const defaultUser = async () => {
    try {
        const defaultEmail = "mentorsacademia@gmail.com"
        const defaultName = "Mentors Admin"
        const defaultPassword = "Mentors@@345"

        const checkDefaultEmail = await signUp.findOne({ email: defaultEmail })

        if (checkDefaultEmail) {
            return;
        }

        if (!checkDefaultEmail) {
            const hashPassword = await bcrypt.hash(defaultPassword, 10);

            const defaultUser = await signUp.create({
                name: defaultName,
                email: defaultEmail,
                password: hashPassword,
                role: "admin"
            });

            console.log("Default user created:", defaultUser);
        }
    } catch (error) {
        console.log(error)
        console.log("Erorr occured during creating default user")
    }
}

defaultUser()

//  api for login user
router.post("/signin", async (req, res) => {
    try {
        const { email, password } = req.body
        const checkUser = await signUp.findOne({ email })
        if (!checkUser) {
            return res.status(400).json({ message: "user with this email not found" })
        }
        const checkPassword = await bcrypt.compare(password, checkUser.password)
        if (!checkPassword) {
            return res.status(400).json({ message: "user with this password not found" })
        }

        res.json(checkUser)
    } catch (error) {
        console.log(error)
        res.status(500).send("internal server error occured")
    }
})

// get all users
router.get("/allusers", async (req, res) => {
    try {
        const allusers = await signUp.find()
        res.json(allusers)
    } catch (error) {
        console.log(error)
        res.status(500).send("internal server error occured")
    }
})

// get user throgh id
router.get("/getuser/:id", async (req, res) => {
    try {
        const userId = await signUp.findById(req.params.id)
        if (!userId) {
            res.status(400).json({ message: "user not exists" })
        }
        res.json(userId)
    } catch (error) {
        console.log(error)
        res.send("internal server error occured")
    }
})
// delete user throgh id
router.delete("/deleteuser/:id", async (req, res) => {
    try {
        const userId = await signUp.findByIdAndDelete(req.params.id)
        if (!userId) {
            res.status(400).json({ message: "user not exists" })
        }
        res.json({ message: "user deleted successfully" })
    } catch (error) {
        console.log(error)
        res.send("internal server error occured")
    }
})
// get user throgh id
router.get("/getuser/:id", async (req, res) => {
    try {
        const userId = await signUp.findById(req.params.id)
        if (!userId) {
            res.status(400).json({ message: "user not exists" })
        }
        res.json(userId)
    } catch (error) {
        console.log(error)
        res.send("internal server error occured")
    }
})

// add course
router.post("/addcourse", upload.single("image"), async (req, res) => {
    try {
        const { title, duration, level, description } = req.body;
        const image = req.file ? req.file.filename : null;

        const newCourse = await Course.create({
            title,
            duration,
            level,
            description,
            image
        });

        res.json(newCourse);
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal server error occurred");
    }
});

// get all courses
router.get("/getAllCourses", async (req, res) => {
    try {
        const allCourses = await Course.find()
        res.json(allCourses)
    } catch (error) {
        console.log(error)
        res.status(500).send("internal server error occured")
    }
})
// get course throgh id
router.get("/getcourse/:id", async (req, res) => {
    try {
        const courseId = await Course.findById(req.params.id)
        if (!courseId) {
            res.status(400).json({ message: "course not exists" })
        }
        res.json(courseId)
    } catch (error) {
        console.log(error)
        res.send("internal server error occured")
    }
})
// update course throgh id
router.put("/updatecourse/:id", async (req, res) => {
    try {
        const { title, duration, level, description } = req.body

        const newCourse = ({})
        if (title) {
            newCourse.title = title
        }
        if (duration) {
            newCourse.duration = duration
        }
        if (level) {
            newCourse.level = level
        }
        if (description) {
            newCourse.description = description
        }

        let courseId = await Course.findById(req.params.id)
        if (!courseId) {
            res.status(400).json({ message: "course not exists" })
        }

        courseId = await Course.findByIdAndUpdate(req.params.id, { $set: newCourse }, { new: true })
        res.json(courseId)
    } catch (error) {
        console.log(error)
        res.send("internal server error occured")
    }
})
// delete course throgh id
router.delete("/deletecourse/:id", async (req, res) => {
    try {
        const courseId = await Course.findByIdAndDelete(req.params.id)
        if (!courseId) {
            res.status(400).json({ message: "course not exists" })
        }
        res.json({ message: "course deleted successfully" })
    } catch (error) {
        console.log(error)
        res.send("internal server error occured")
    }
})

// add teacher
router.post("/addteacher", async (req, res) => {
    try {
        const { name, email, number, qualification, experience, description } = req.body
        const newTeacher = await Teacher.create({
            name,
            email,
            number,
            qualification,
            experience,
            description
        })

        res.json(newTeacher)

    } catch (error) {
        console.log(error)
        res.status(500).send("internal server error occured")
    }
})
// get all techers
router.get("/getAllTeachers", async (req, res) => {
    try {
        const allTeachers = await Teacher.find()
        res.json(allTeachers)
    } catch (error) {
        console.log(error)
        res.status(500).send("internal server error occured")
    }
})
// get teacher throgh id
router.get("/getteacher/:id", async (req, res) => {
    try {
        const teacherId = await Teacher.findById(req.params.id)
        if (!teacherId) {
            res.status(400).json({ message: "course not exists" })
        }
        res.json(teacherId)
    } catch (error) {
        console.log(error)
        res.send("internal server error occured")
    }
})
// update teacher throgh id
router.put("/updateteacher/:id", async (req, res) => {
    try {
        const { name, email, number, qualification, experience, description } = req.body

        const newTeacher = ({})
        if (name) {
            newTeacher.name = name
        }
        if (email) {
            newTeacher.email = email
        }
        if (number) {
            newTeacher.number = number
        }
        if (qualification) {
            newTeacher.qualification = qualification
        }
        if (experience) {
            newTeacher.experience = experience
        }
        if (description) {
            newTeacher.description = description
        }

        let teacherId = await Teacher.findById(req.params.id)
        if (!teacherId) {
            res.status(400).json({ message: "course not exists" })
        }

        teacherId = await Teacher.findByIdAndUpdate(req.params.id, { $set: newTeacher }, { new: true })
        res.json(teacherId)
    } catch (error) {
        console.log(error)
        res.send("internal server error occured")
    }
})
// delete teacher throgh id
router.delete("/deleteteacher/:id", async (req, res) => {
    try {
        const teacherId = await Teacher.findByIdAndDelete(req.params.id)
        if (!teacherId) {
            res.status(400).json({ message: "course not exists" })
        }
        res.json({ message: "course deleted successfully" })
    } catch (error) {
        console.log(error)
        res.send("internal server error occured")
    }
})

// add school
router.post("/addschool", async (req, res) => {
    try {
        const { name, email, number, city, address, website } = req.body
        const newSchool = await School.create({
            name,
            email,
            number,
            city,
            address,
            website
        })

        res.json(newSchool)

    } catch (error) {
        console.log(error)
        res.status(500).send("internal server error occured")
    }
})
// get all schools
router.get("/getAllSchools", async (req, res) => {
    try {
        const allSchools = await School.find()
        res.json(allSchools)
    } catch (error) {
        console.log(error)
        res.status(500).send("internal server error occured")
    }
})
// get teacher throgh id
router.get("/getschool/:id", async (req, res) => {
    try {
        const schoolId = await School.findById(req.params.id)
        if (!schoolId) {
            res.status(400).json({ message: "course not exists" })
        }
        res.json(schoolId)
    } catch (error) {
        console.log(error)
        res.send("internal server error occured")
    }
})
// update course throgh id
router.put("/updateschool/:id", async (req, res) => {
    try {
        const { name, email, number, city, address, website } = req.body

        const newSchool = ({})
        if (name) {
            newSchool.name = name
        }
        if (email) {
            newSchool.email = email
        }
        if (number) {
            newSchool.number = number
        }
        if (city) {
            newSchool.city = city
        }
        if (address) {
            newSchool.address = address
        }
        if (website) {
            newSchool.website = website
        }

        let schoolId = await School.findById(req.params.id)
        if (!schoolId) {
            return res.status(400).json({ message: "school not exists" })
        }

        schoolId = await School.findByIdAndUpdate(req.params.id, { $set: newSchool }, { new: true })
        res.json(schoolId)
    } catch (error) {
        console.log(error)
        res.send("internal server error occured")
    }
})
// delete teacher throgh id
router.delete("/deleteschool/:id", async (req, res) => {
    try {
        const schoolId = await School.findByIdAndDelete(req.params.id)
        if (!schoolId) {
            res.status(400).json({ message: "course not exists" })
        }
        res.json({ message: "course deleted successfully" })
    } catch (error) {
        console.log(error)
        res.send("internal server error occured")
    }
})
module.exports = router;