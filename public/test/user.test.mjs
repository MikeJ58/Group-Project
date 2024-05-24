import { use, expect } from 'chai'
import chaiHttp from 'chai-http';
import app from '../app.js'; // Adjust the path to your app.js if necessary
import pkg from '../models/user.js';
import User from '../models/user.js';
import connectDB from '../config/db.js';
import { describe, it } from 'mocha'; // Importing describe, it from Mocha
import { isLoggedIn } from '../middlewares/authMiddleware.js';

const { deleteMany, create } = pkg;

const chai = use(chaiHttp);

describe('User API', () => {
    before(async () => {
        // Connect to the database if not already connected
        await connectDB();
    });

    before(async () => {
        // Clear the users collection before each test
        await User.deleteMany({});
    });

    describe('POST /register', () => {
        it('should register a new user', (done) => {
            const user = {
                username: 'testuser',
                password: 'testpassword'
            };
            chai
                .request(app)
                .post('/register')
                .send(user)
                .end((err, res) => {
                    expect(res).to.have.status(201);
                    expect(res.body).to.be.an('object');
                    expect(res.body).to.have.property('message', 'User registered successfully');
                    expect(res.body.user).to.have.property('username', 'testuser');
                    done();
                });
        });

        it('should not register a user with an existing username', (done) => {
            const user = {
                username: 'testuser',
                password: 'testpassword'
            };
            chai
                .request(app)
                .post('/register')
                .send(user)
                .end((err, res) => {
                    expect(res).to.have.status(400);
                    expect(res.body).to.be.an('object');
                    expect(res.body).to.have.property('message', 'Username already exists');
                    done();
                });
        });
    });

    describe('POST /login', () => {
        it('should log in an existing user', (done) => {
            const user = {
                username: 'testuser',
                password: 'testpassword'
            };
            chai
                .request(app)
                .post('/login')
                .send(user)
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.an('object');
                    expect(res.body).to.have.property('message', 'Login successful');
                    done();
                });
        });

        it('should not log in a user with invalid credentials', (done) => {
            const user = {
                username: 'testuser',
                password: 'wrongpassword'
            };
            chai
                .request(app)
                .post('/login')
                .send(user)
                .end((err, res) => {
                    expect(res).to.have.status(401);
                    expect(res.body).to.be.an('object');
                    expect(res.body).to.have.property('message', 'Invalid username or password');
                    done();
                });
        });
    });

    describe('PUT /update-profile', () => {
        it('should update the user profile', (done) => {
            const user = {
                _id: 'someUserId', // Assuming this is the session ID
                username: 'testuser',
                password: 'testpassword'
            };

            const updatedUser = {
                username: 'updateduser',
                password: 'updatedpassword'
            };

            // Simulate the user being logged in by setting session data
            const agent = chai.request.agent(app); // Create an agent to persist cookies
            agent
                .post('/login') // Assuming you have a login route
                .send({ username: user.username, password: user.password })
                .end((loginErr, loginRes) => {
                    // Now make the PUT request to update the profile

                    // Extract session ID from the response cookies
                    const sessionId = loginRes.headers['set-cookie'][0].split(';')[0].split('=')[1];

                    agent
                        .put(`/profile/:${sessionId}`)
                        .send(updatedUser)
                        .end((err, res) => {
                            expect(res).to.have.status(200);
                            expect(res.body).to.be.an('object');
                            expect(res.body).to.have.property('message', 'Profile updated successfully');
                            expect(res.body.user).to.have.property('username', 'updateduser');
                            done();
                        });
                });
        });
        it('should return 404 if not authenticated', (done) => {
            const updatedUser = {
                username: 'updateduser',
                password: 'updatedpassword'
            };
            chai
                .request(app)
                .put('/profile/')
                .send(updatedUser)
                .end((err, res) => {
                    expect(res).to.have.status(404);
                    expect(res.body).to.be.an('object');
                    done();
                });
        });
    });

    describe('DELETE /delete-user', () => {
        it('should delete an existing user', (done) => {
            const user = {
                username: 'updateduser',
                password: 'updatedpassword'
            };

            chai
                .request(app)
                .delete('/delete-user')
                .send(user)
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.an('object');
                    expect(res.body).to.have.property('message', 'User deleted successfully');
                    done();
                });
        });
    });
})
