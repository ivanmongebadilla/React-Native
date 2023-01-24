import { FlatList, StyleSheet, Text, View, Button, Modal } from 'react-native';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import RenderCampsite from '../features/campsites/RenderCampsite';
import { toggleFavorite } from '../features/favorites/favoritesSlice';
import { Input, Rating } from 'react-native-elements';
import { postComment } from '../features/comments/commentsSlice';
import * as Animatable from 'react-native-animatable'


const CampsiteInfoScreen = ({ route }) => {
    const [showModal, setShowModal] = useState(false);
    const [rating, setRating] = useState(5);
    const [author, setAhutor] = useState('');
    const [text, setText] = useState('');
    const { campsite } = route.params;

    const comments = useSelector((state) => state.comments);
    const favorites = useSelector((state) => state.favorites);
    const dispatch = useDispatch();

    const renderCommentItem = ({item}) => {
      return (
        <View style={StyleSheet.commentItem}>
          <Text style={{fontSize: 14}}>{item.text}</Text>
          <Rating 
            startingValue={item.rating}
            imageSize= {10}
            style={{alignItems: 'flex-start', paddingVertical: '5%'}}
            readonly
          />
          <Text style={{ fontSize: 12, marginBottom: 10 }}>{`-- ${item.author}, ${item.date}`}</Text>
        </View>
      )
    }

    const handleSubmit = () => {
      const newComment = {
        author,
        rating,
        text,
        campsiteId: campsite.id
      };

      dispatch(postComment(newComment))
      setShowModal(!showModal)
    }

    const resetForm = () => {
      setRating(5);
      setAhutor('');
      setText('');
    }

  return (
    <Animatable.View
      animation='fadeInUp'
      duration={2000}
      delay={1000}
    >
      <FlatList 
        data={comments.commentsArray.filter((comments) => comments.campsiteId === campsite.id)}
        renderItem={renderCommentItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ marginHorizontal: 20, paddingVertical: 20 }}
        ListHeaderComponent={
          <>
            <RenderCampsite 
              campsite={campsite} 
              isFavorite={favorites.includes(campsite.id)} 
              markFavorite={() => dispatch(toggleFavorite(campsite.id))}
              onShowModal={() => setShowModal(!showModal)} 
            />
            <Text style={styles.commentsTitle}>Comments</Text>
          </>
        }
      />
      <Modal
        animationType='slide'
        transparent={false}
        visible={showModal}
        onRequestClose={() => setShowModal(!showModal)}
      >
        <View style={styles.modal}>
          <Rating 
            type='star'
            showRating
            startingValue={rating}
            imageSize={20}
            onFinishRating={(rating)=> setRating(rating)}
            style={{paddingVertical: 10}}
          />
          <Input 
            placeholder='Author'
            leftIcon={{ type: 'font-awesome', name: 'user-o' }}
            leftIconContainerStyle={{paddingRight: 10}}
            onChangeText={(value)=> setAhutor(value)}
          />
          <Input 
            placeholder='Comment'
            leftIcon={{ type: 'font-awesome', name: 'comment-o' }}
            leftIconContainerStyle={{paddingRight: 10}}
            onChangeText={(value)=> setText(value)}
          />
          <View style={{margin: 10}}>
            <Button 
              onPress={() => {
                handleSubmit();
                resetForm();
              }}
              color=  '#5637DD'
              title='Submit'
            />
          </View>
          <View style={{margin: 10}}>
            <Button 
              onPress={() => {
                setShowModal(!showModal);
                resetForm();
              }}
              color='#808080'
              title='Cancel'  
            />
          </View>
        </View>
      </Modal>
    </Animatable.View>
  );
};

const styles = StyleSheet.create({
  commentsTitle: {
      textAlign: 'center',
      backgroundColor: '#fff',
      fontSize: 16,
      fontWeight: 'bold',
      color: '#43484D',
      padding: 10,
      paddingTop: 30
  },
  commentItem: {
      paddingVertical: 10,
      paddingHorizontal: 20,
      backgroundColor: '#fff'
  },
  modal: {
    justifyContent: 'center',
    margin: 20
  }
});

export default CampsiteInfoScreen