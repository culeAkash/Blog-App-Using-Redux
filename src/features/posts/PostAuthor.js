import { useSelector } from "react-redux";
import { selectAllUsers } from "../users/usersSlice";

const PostAuthor = ({ userId }) => {
    const users = useSelector(selectAllUsers)

    console.log(users);

    console.log(userId);

    const author = users.find(user => {
        console.log(user.id);
        console.log(userId);
        return Number(userId) === user.id
    });

    console.log(author);

    return <span>by {author ? author.name : 'Unknown author'}</span>
}
export default PostAuthor