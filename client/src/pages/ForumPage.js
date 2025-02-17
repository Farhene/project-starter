import React from 'react';
import ForumThreadRow from '../components/Forum/ForumThreadRow.js';
import '../css/ForumCategoryTable.css';
import '../css/ForumStarterTable.css';
import auth from '../services/auth';
<style>@import url('https://fonts.googleapis.com/css2?family=Inter:wght@900&display=swap');</style>
class ForumPage extends React.Component  {
    state = {
      error: false,
      success: false,
      category: '',
      threadTitle: '',
      id: 0,
      threads: [],
    }
  
    contentChanged = (name) => {
      return (event) => {
        let { value } = event.target;
        this.setState({ [name]: value });
      }
    }
  
    postThread = (event) => {
      event.preventDefault();

      fetch("/api/forum/", {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          category: this.state.category,
          threadTitle: this.state.threadTitle,
          authorId: auth.currentUser.id,
        }),
      })      
        .then(res => res.json())
        .then(post => {
            this.setState({
              success: true,
            });
            alert('Posted successfully!');    
        })
        .catch(err => {
          this.setState({
            error: true,
          });
        });
      this.setState({
        category: '',
        threadTitle: '',
      })
    }

    componentDidMount() {
      fetch('/api/forum')
      .then(res => res.json())
      .then(threads => {
        this.setState({
          threads: threads.map((p, ii) => 
              <ForumThreadRow {...p} key={ii} />
            ),
        });
      })
      .catch(err => console.log("API ERROR: ", err));
      
    }
  
  render() {
    // console.log(this.state.threads[0].props.id);
    if(!auth.isAuthenticated) {
      return (
        <div className="div-heading">
          <h1 class="title">
            Fitbud Forum Page
          </h1>
          <br></br>
          <br></br>
          <section>
              <table className="thread-starter-table">
                <tr>
                    <th> Title/Thread Starter</th> {/* <th> Last Post By</th> */}{/* <th> Replies</th> */}
                </tr>
        
                {/* ForumThreadRow will be MAPPED like an array to showcase all threads we have in the Forum here */}
                <tr>
                  <ForumThreadRow threads = {this.state.threads} />
                </tr>

              </table>
          </section>
        </div>
      )
    }

  return (
    <div className="div-heading">
      <h1>
        Fitbud Forum Page
      </h1>
      <br></br>
      <br></br>

      <form onSubmit={this.postThread}>
          <div className="thread-create">
            <input 
              placeholder="Enter Thread Title"
              maxLength="100"
              minLength="3"
              className="thread-new"
              value={this.state.threadTitle}
              onChange={this.contentChanged('threadTitle')}
              />
            <input 
              placeholder="Enter Thread Category"
              maxLength="10"
              minLength="3"
              className="thread-new"
              value={this.state.category}
              onChange={this.contentChanged('category')}
            />
            <button className="new-thread-button" type="submit"> 
              Post New Thread
            </button>
          </div>
      </form>
      <br></br>

      <section>
          <table className="thread-starter-table">
            <tr>
              <th> Title/Thread Starter</th> {/* <th> Last Post By</th> */}{/* <th> Replies</th> */}
            </tr>
                <ForumThreadRow threads={this.state.threads} />
          </table>
        </section>
    </div>
    );
  }
}

export default ForumPage;
