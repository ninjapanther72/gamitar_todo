import React, {useEffect, useRef, useState} from 'react';
import {checkNullArr} from "./ReactUtils";
import PropTypes from "prop-types";
import Tag from "./Tag";


/*
Ideas to further modify and enhance the TagInputLayout component:
- Input Validation: Add validation to the input field, such as checking for duplicate tags, enforcing a maximum tag length, or validating input format.
- Tag Styling: Customize the styling of tags and the input field to match your application's design. Add animations or transitions for smoother interactions.
- Tag Suggestions: Implement tag suggestions or autocomplete functionality based on a predefined list of options or dynamically fetched suggestions.
- Tag Sorting: Add sorting capabilities to the tag list, allowing users to sort tags alphabetically or by some other criteria.
- Tag Filtering: Enable filtering of tags based on search criteria, allowing users to quickly find specific tags in a large list.
- Tag Drag and Drop: Implement drag and drop functionality to allow users to reorder tags by dragging them within the tag list.
- Tag Categories: Introduce the concept of tag categories or groups, allowing users to assign tags to specific categories and filter or manage them accordingly.
- Tag Persistence: Store the tag list in local storage or a server database, allowing users to retrieve their tags across sessions or devices.
- Custom Delimiter: Allow users to specify a custom delimiter for separating tags instead of just a comma.
- Multiline Input: Support multiline input, allowing users to enter multiple tags separated by line breaks.
- Tag Editing: Enable users to edit existing tags by clicking on them, providing an in-place editing experience.
- Tag Events: Implement additional events for tags, such as hover effects, tooltips, or right-click menus for more interaction options.
- Tag Colors and Styles: Allow users to assign different colors or styles to individual tags for better visual organization or categorization.
- Tag Count: Display the count of tags next to the input field or as a separate component to provide a quick overview of the total number of tags.
- Tag Persistence Options: Provide options to persist tags permanently or temporarily, allowing users to choose whether tags should be saved or cleared after a certain period.
- Tag Search: Implement a search functionality to filter and highlight tags based on a user-entered search term, making it easier to find specific tags within a large list.
- Tag Grouping: Introduce the ability to group tags together, allowing users to create nested or hierarchical structures for more organized tagging.
- Tag Collaboration: Enable real-time collaboration on tags, allowing multiple users to add, edit, or remove tags simultaneously and see changes in real-time.
- Tag Import/Export: Provide the ability to import and export tags as a file or in a specific format, allowing users to backup, share, or transfer their tag data.
- Tag Suggestions Based on Content: Implement intelligent suggestions for tags based on the content or context of the input, such as extracting keywords or using machine learning algorithms.
- Tag Permissions: Introduce permission settings for tags, allowing certain users or user roles to have specific access or editing rights for individual tags.
- Tag Notifications: Enable notifications or alerts when a specific tag is added, edited, or removed, providing updates and triggering relevant actions.
- Tag History: Keep a log or history of changes made to tags, allowing users to track modifications, revert to previous versions, or view activity related to specific tags.
- Tag Export Options: Offer various export options for tags, such as exporting them as a CSV file, generating a printable tag sheet, or integrating with other applications or platforms.
* */

//https://reactjsexample.com/a-fantastically-simple-tagging-component-for-your-react-projects-2/
//https://github.com/yairEO/tagify
//https://github.com/react-tags/react-tags
//https://github.com/cluemediator/react-tag-input-example
const TagInputLayout = ({
                            delimiter = ',', children,
                        }) => {
    const TAG = "TagInputLayout";

    const [tags, setTags] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [activeIndex, setActiveIndex] = useState(-1);
    const inputRef = useRef(null);

    useEffect(() => {
        if (checkNullArr(children)) {
            setTags(children);
        }
    }, [children]);

    const addTag = () => {
        const trimmedValue = inputValue.trim();
        if (trimmedValue !== '') {
            setTags([...tags, trimmedValue]);
            setInputValue('');
            setActiveIndex(-1);
            inputRef.current.focus();
        }
    };

    const handleRemoveTag = (tag) => {
        setTags(tags.filter((t) => t !== tag));
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter' || event.key === delimiter) {
            event.preventDefault();
            addTag();
        } else if (event.key === 'Backspace' && inputValue === '') {
            event.preventDefault();
            if (tags.length > 0) {
                setInputValue(tags[tags.length - 1]);
                setTags(tags.slice(0, tags.length - 1));
                setActiveIndex(-1);
                inputRef.current.focus();
            }
        } else if (event.key === 'ArrowLeft') {
            event.preventDefault();
            if (activeIndex > 0) {
                setActiveIndex(activeIndex - 1);
            }
        } else if (event.key === 'ArrowRight') {
            event.preventDefault();
            if (activeIndex < tags.length - 1) {
                setActiveIndex(activeIndex + 1);
            }
        } else if (event.ctrlKey && event.key === 'a') {
            event.preventDefault();
            setActiveIndex(-1);
        } else if (event.key === 'Delete') {
            event.preventDefault();
            if (activeIndex > -1) {
                handleRemoveTag(tags[activeIndex]);
                setActiveIndex(-1);
                inputRef.current.focus();
            } else if (tags.length > 0) {
                setTags([]);
                setActiveIndex(-1);
                inputRef.current.focus();
            }
        }
    };

    const handleClickTag = (index, text) => {
        // handleRemoveTag(text);
        setActiveIndex(index);
        setInputValue(text);
    };

    return (<div className="tag-input-layout d-flex justify-content-start fd-row flex-wrap rounded-3 border-1-5 border-solid border-primary">
        {tags.map((tag, index) => (<Tag
            key={tag}
            tag={tag}
            onRemoveTag={handleRemoveTag}
            isActive={index === activeIndex}
            onClick={(text) => handleClickTag(index, text)}
        />))}
        <div className="tag-input">
            <input
                type="text"
                value={inputValue}
                ref={inputRef}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
            />
        </div>
    </div>);
};
TagInputLayout.propTypes = {
    delimiter: PropTypes.string,
    children: PropTypes.object,
};
export default TagInputLayout;
