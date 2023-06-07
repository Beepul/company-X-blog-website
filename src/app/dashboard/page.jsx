"use client"
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import useSWR  from 'swr';
import styles from './page.module.css';

import React from 'react'
import Image from 'next/image';
import Link from 'next/link';


const Dashboard = () => {
  const session = useSession()
  const router = useRouter()

  const fetcher = (...args) => fetch(...args).then((res)=> res.json());

  const {data, mutate, error,isLoading} = useSWR(`/api/posts?username=${session?.data?.user.name}`,fetcher);
  console.log(data);

  if(session.status === "loading"){
    return <p>loading...</p>
  }
  if(session.status === "unauthenticated"){
    router?.push("/dashboard/login")
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    const title = e.target[0].value;
    const desc = e.target[1].value;
    const img = e.target[2].value;
    const content = e.target[3].value;

    try {
      await fetch("/api/posts",{
        method: "POST",
        body: JSON.stringify({
          title,desc,img,content,username: session.data.user.name
        })
      });
      mutate();
      e.target.reset();
    } catch (error) {
      console.log(error)
    }
  }

  const handleDelete = async (id) => {
    try {
      await fetch(`api/posts/${id}`,{
        method: "DELETE"
      });
      mutate();
    } catch (error) {
      console.log(error)
    }
  }
  if(session.status === "authenticated"){
    return (
      <div className={styles.container}>
        <div className={styles.posts}>
          {isLoading ? "loading..." : data?.map((post)=> (
            <Link href={`/blog/${post._id}`} key={post._id}>
            <div className={styles.post} >
              <div className={styles.imgContainer}>
                <Image src={post.img} width={200} height={100} className={styles.img} />
              </div>
              <h2 className={styles.postTitle}>{post.title}</h2>
              <span className={styles.delete} onClick={()=>handleDelete(post._id)}>X</span>
            </div>
            </Link>
          ))}
        </div>
        <form className={styles.new} onSubmit={handleSubmit}>
          <h1>Add New Post</h1>
          <input type='text' placeholder='Title' className={styles.input} />
          <input type='text' placeholder='Desc' className={styles.input} />
          <input type='text' placeholder='Image' className={styles.input} />
          <textarea placeholder='Content' cols={"30"} rows={"10"} className={styles.textArea} />
          <button className={styles.button}>Send</button>
        </form>
      </div>
    )
  }
}

export default Dashboard