import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Spinner from '../common/Spinner';
import { getProfiles } from '../../actions/profileActions'

class Profiles extends Component {
   componentDidMount() {
      this.props.getProfiles();
   }
   render() {
      const { profiles, loading } = this.props.profile;
      let profileItems;

      if (profiles === null || loading) {
         profileItems = <Spinner />;
      } else {
         if (profiles.length > 0) {
            profileItems = <h1>Profiles Here</h1>
         } else {
            profileItems = <h4>No Profiles Found...</h4>
         }
      }
      return (
         <div class="profiles">
            <div class="container">
               <div class="row">
                  <div class="col-md-12">
                     <h1 class="display-4 text-center">Developer Profiles</h1>
                     <p class="lead text-center">Browse and connect with developers</p>
                     {profileItems}
                  </div>
               </div>
            </div>
         </div>
      )
   }
}

Profiles.propTypes = {
   getProfiles: PropTypes.func.isRequired,
   profile: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
   profile: state.profile
})

export default connect(mapStateToProps, { getProfiles })(Profiles);