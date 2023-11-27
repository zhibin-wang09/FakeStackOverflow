export default function SideBarTabs(props){
    const activeClass = props.isActive ? 'text-teal-600 border-b-2 border-teal-600' : '';

    return (
        <p id="sidebar-question" className={`font-bold text-1xl m-15 relative w-max two ${activeClass}`}>
            <span>
                <span id={props.id} onClick={props.handlePageChange}>{props.tabName}</span>
            </span>
            <span className="absolute -bottom-1 left-1/2 w-0 transition-all h-1 bg-teal-400"></span>
            <span className="absolute -bottom-1 right-1/2 w-0 transition-all h-1 bg-teal-400"></span>
        </p>
    );
}
