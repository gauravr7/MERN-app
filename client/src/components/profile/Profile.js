import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import ProfileHeader from './ProfileHeader';
import ProfileCreds from './ProfileCreds';
import ProfileAbout from './ProfileAbout';
import ProfileGithub from './ProfileGithub';
import Spinner from '../common/Spinner';
import { getProfileByHandle } from '../../actions/profileActions';

class Profile extends Component {
   componentDidMount() {
      if (this.props.match.params.handle) {
         this.props.getProfileByHandle(this.props.match.params.handle);
      }

   }
   render() {
      return (
         <div>
            <ProfileHeader></ProfileHeader>
            <ProfileAbout></ProfileAbout>
            <ProfileCreds></ProfileCreds>
            <ProfileGithub></ProfileGithub>
         </div>
      )
   }
}
Profile.propTypes = {
   profile: PropTypes.object.isRequired,
   getProfileByHandle: PropTypes.func.isRequired
}

const mapStateToProps = state => ({
   profile: state.profile
})

export default connect(mapStateToProps, { getProfileByHandle })(Profile);